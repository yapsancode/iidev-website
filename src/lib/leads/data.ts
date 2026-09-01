import { getDb } from "@/lib/cloudflare/env";
import { hydrateLead } from "@/lib/cloudflare/rows";
import type { LeadRecord, LeadStatus } from "./types";

const closedStatuses: LeadStatus[] = ["won","lost","not_fit"];
export interface LeadFilters { query?:string; status?:string; priority?:string; owner?:string; }
export type LeadWithOwner=LeadRecord&{owner?:{id:string;full_name:string;email:string}|null};
export interface NoteRow { id:string;body:string;created_at:string;author?:{full_name:string;email:string}|null; }
export interface EventRow { id:number;event_type:string;metadata:Record<string,unknown>;created_at:string; }
export interface UserRow { id:string;full_name:string;email:string; }
interface InsightEvent { lead_id:string;event_type:string;metadata:Record<string,unknown>;created_at:string; }

export async function getDashboardData() {
  const result = await (await getDb()).prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 100").all<Record<string,unknown>>();
  const leads = result.results.map((r)=>hydrateLead(r as Record<string,unknown>));
  const open = leads.filter((l)=>!closedStatuses.includes(l.status));
  return { leads,recent:open.slice(0,5),openCount:open.length,highPriorityCount:open.filter(l=>l.priority==="high").length,needsReviewCount:open.filter(l=>l.priority==="needs_review"||l.processing_status==="failed").length,missedFollowUps:open.filter(l=>l.status==="new"&&Date.now()-new Date(l.created_at).getTime()>259200000).length };
}

export async function listLeads(filters:LeadFilters={}):Promise<LeadWithOwner[]> {
  const where:string[]=[]; const values:unknown[]=[];
  if(filters.status){where.push("l.status=?");values.push(filters.status);} if(filters.priority){where.push("l.priority=?");values.push(filters.priority);} if(filters.owner){where.push("l.owner_id=?");values.push(filters.owner);}
  if(filters.query){where.push("(l.full_name LIKE ? OR l.business_name LIKE ? OR l.email LIKE ?)"); const q=`%${filters.query.replace(/[%_]/g,"")}%`;values.push(q,q,q);}
  const sql=`SELECT l.*,u.id owner_join_id,u.full_name owner_full_name,u.email owner_email FROM leads l LEFT JOIN internal_users u ON u.id=l.owner_id ${where.length?`WHERE ${where.join(" AND ")}`:""} ORDER BY l.created_at DESC LIMIT 250`;
  const rows=(await (await getDb()).prepare(sql).bind(...values).all<Record<string,unknown>>()).results;
  return rows.map((row)=>{const lead=hydrateLead(row) as LeadWithOwner; lead.owner=row.owner_join_id?{id:String(row.owner_join_id),full_name:String(row.owner_full_name),email:String(row.owner_email)}:null; return lead;});
}

export async function getLeadDetails(id:string):Promise<{lead:LeadWithOwner|null;notes:NoteRow[];events:EventRow[];users:UserRow[]}> {
  const db=await getDb();
  const [leadRow,notesResult,eventsResult,usersResult]=await Promise.all([
    db.prepare("SELECT l.*,u.id owner_join_id,u.full_name owner_full_name,u.email owner_email FROM leads l LEFT JOIN internal_users u ON u.id=l.owner_id WHERE l.id=?").bind(id).first<Record<string,unknown>>(),
    db.prepare("SELECT n.*,u.full_name author_full_name,u.email author_email FROM lead_notes n LEFT JOIN internal_users u ON u.id=n.author_id WHERE n.lead_id=? ORDER BY n.created_at DESC").bind(id).all<Record<string,unknown>>(),
    db.prepare("SELECT * FROM lead_events WHERE lead_id=? ORDER BY created_at DESC LIMIT 100").bind(id).all<Record<string,unknown>>(),
    db.prepare("SELECT id,full_name,email FROM internal_users WHERE active=1 ORDER BY full_name").all<UserRow>(),
  ]);
  let lead:LeadWithOwner|null=null;
  if(leadRow){lead=hydrateLead(leadRow) as LeadWithOwner; lead.owner=leadRow.owner_join_id?{id:String(leadRow.owner_join_id),full_name:String(leadRow.owner_full_name),email:String(leadRow.owner_email)}:null;}
  const notes:NoteRow[]=notesResult.results.map((r)=>({id:String(r.id),body:String(r.body),created_at:String(r.created_at),author:r.author_full_name?{full_name:String(r.author_full_name),email:String(r.author_email)}:null}));
  const events:EventRow[]=eventsResult.results.map((r)=>({id:Number(r.id),event_type:String(r.event_type),created_at:String(r.created_at),metadata:typeof r.metadata==="string"?JSON.parse(r.metadata):{}}));
  return {lead,notes,events,users:usersResult.results};
}

export async function getInsightsData(){
  const since=new Date(Date.now()-90*86400000).toISOString(); const db=await getDb();
  const [lr,er]=await Promise.all([db.prepare("SELECT * FROM leads WHERE created_at>=? ORDER BY created_at").bind(since).all<Record<string,unknown>>(),db.prepare("SELECT lead_id,event_type,metadata,created_at FROM lead_events WHERE created_at>=? ORDER BY created_at").bind(since).all<Record<string,unknown>>()]);
  const records=lr.results.map(r=>hydrateLead(r)); const events:InsightEvent[]=er.results.map(r=>({lead_id:String(r.lead_id),event_type:String(r.event_type),created_at:String(r.created_at),metadata:typeof r.metadata==="string"?JSON.parse(r.metadata):{}}));
  const completed=records.filter(l=>l.processing_status==="complete"||l.processing_status==="needs_review"),scored=records.filter(l=>l.lead_score!==null);
  const responseMinutes=events.filter(e=>e.event_type==="status_changed"&&(e.metadata as {status?:string}).status==="contacted").map(e=>{const l=records.find(r=>r.id===e.lead_id);return l?Math.max(0,(new Date(String(e.created_at)).getTime()-new Date(l.created_at).getTime())/60000):null;}).filter((v):v is number=>v!==null);
  const demand=new Map<string,number>(); records.forEach(l=>l.ai_extraction?.requestedServices.forEach(s=>demand.set(s,(demand.get(s)||0)+1)));
  return {total:records.length,averageScore:scored.length?Math.round(scored.reduce((s,l)=>s+(l.lead_score||0),0)/scored.length):null,aiReliability:completed.length?Math.round(completed.filter(l=>l.processing_status==="complete").length/completed.length*100):null,averageResponseMinutes:responseMinutes.length?Math.round(responseMinutes.reduce((a,b)=>a+b,0)/responseMinutes.length):null,missedFollowUps:records.filter(l=>l.status==="new"&&Date.now()-new Date(l.created_at).getTime()>259200000).length,serviceDemand:[...demand.entries()].sort((a,b)=>b[1]-a[1]),records};
}
