"use strict";(()=>{var e={};e.id=553,e.ids=[553],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5861:e=>{e.exports=require("node:sqlite")},7561:e=>{e.exports=require("node:fs")},9411:e=>{e.exports=require("node:path")},302:(e,s,t)=>{t.r(s),t.d(s,{originalPathname:()=>E,patchFetch:()=>g,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>O,staticGenerationAsyncStorage:()=>_});var a={};t.r(a),t.d(a,{GET:()=>c,dynamic:()=>p});var n=t(9303),r=t(8716),o=t(3131),i=t(7070),u=t(5748),d=t(716);let p="force-dynamic";async function c(e){try{(0,d.Y)();let e=(0,u.z)(),s=e.prepare("SELECT COUNT(*) as count FROM assessment_sessions").get(),t=e.prepare('SELECT COUNT(*) as count FROM assessment_sessions WHERE status = "completed"').get(),a=e.prepare('SELECT COUNT(*) as count FROM assessment_sessions WHERE status = "in_progress"').get(),n=e.prepare(`
      SELECT set_code, COUNT(*) as count
      FROM assessment_sessions
      GROUP BY set_code
    `).all(),r=e.prepare(`
      SELECT st.name as state_name, COUNT(s.id) as count
      FROM assessment_sessions s
      JOIN states st ON s.state_id = st.id
      GROUP BY st.name
      ORDER BY count DESC
      LIMIT 10
    `).all(),o=e.prepare(`
      SELECT l.name as language_name, l.code, COUNT(s.id) as count
      FROM assessment_sessions s
      JOIN languages l ON s.language_code = l.code
      GROUP BY l.name, l.code
      ORDER BY count DESC
    `).all(),p=e.prepare(`
      SELECT r.id, r.session_id, r.total_score, r.percentage, r.provisional_level,
             r.generated_at, st.name as state_name, l.name as language_name,
             s.set_code
      FROM assessment_results r
      JOIN assessment_sessions s ON r.session_id = s.id
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN languages l ON s.language_code = l.code
      ORDER BY r.generated_at DESC
      LIMIT 15
    `).all(),c=e.prepare("SELECT * FROM assessment_sets ORDER BY id ASC").all();return i.NextResponse.json({success:!0,data:{total_sessions:s?.count||0,completed_sessions:t?.count||0,in_progress_sessions:a?.count||0,live_actual_sessions:s?.count||0,live_actual_completed:t?.count||0,set_distribution:n,state_distribution:r,language_distribution:o,recent_completions:p,question_sets:c}})}catch(e){return i.NextResponse.json({success:!1,error:e.message},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:"app/api/admin/stats/route"},resolvedPagePath:"C:\\dev\\survey\\src\\app\\api\\admin\\stats\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:_,serverHooks:O}=l,E="/api/admin/stats/route";function g(){return(0,o.patchFetch)({serverHooks:O,staticGenerationAsyncStorage:_})}}};var s=require("../../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[276,972,716],()=>t(302));module.exports=a})();