interface Env { DB:D1Database; }

const retentionWorker = {
  async scheduled(_controller:ScheduledController,env:Env):Promise<void> {
    const twelve=new Date(); twelve.setMonth(twelve.getMonth()-12);
    const twentyFour=new Date(); twentyFour.setMonth(twentyFour.getMonth()-24);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM leads WHERE status IN ('lost','not_fit') AND last_activity_at<?").bind(twelve.toISOString()),
      env.DB.prepare("UPDATE leads SET retention_review_due=1 WHERE status NOT IN ('lost','not_fit') AND last_activity_at<?").bind(twentyFour.toISOString()),
      // Outbound prospects we gave up on follow the same 12-month rule.
      env.DB.prepare("DELETE FROM prospects WHERE status IN ('lost','not_fit') AND last_activity_at<?").bind(twelve.toISOString()),
    ]);
  },
};

export default retentionWorker;
