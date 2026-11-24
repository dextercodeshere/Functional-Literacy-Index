"use strict";(()=>{var e={};e.id=204,e.ids=[204],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5861:e=>{e.exports=require("node:sqlite")},7561:e=>{e.exports=require("node:fs")},9411:e=>{e.exports=require("node:path")},4924:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>x,patchFetch:()=>v,requestAsyncStorage:()=>m,routeModule:()=>u,serverHooks:()=>_,staticGenerationAsyncStorage:()=>g});var a={};s.r(a),s.d(a,{GET:()=>l,dynamic:()=>c});var r=s(9303),n=s(8716),o=s(3131),i=s(7070),p=s(5748),d=s(716);let c="force-dynamic";async function l(e){try{(0,d.Y)();let t=(0,p.z)(),{searchParams:s}=new URL(e.url),a=s.get("format")||"json",r=t.prepare(`
      SELECT 
        s.id as session_id,
        st.name as state,
        c.name as city,
        l.name as language,
        s.started_at,
        s.completed_at,
        s.status,
        r.total_score,
        r.percentage,
        r.meets_benchmark,
        r.provisional_level,
        r.strongest_skill
      FROM assessment_sessions s
      LEFT JOIN assessment_results r ON s.id = r.session_id
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN cities c ON s.city_id = c.id
      LEFT JOIN languages l ON s.language_code = l.code
      ORDER BY s.started_at DESC
    `).all();if("csv"===a){let e=r.map(e=>[e.session_id,`"${e.state||"N/A"}"`,`"${e.city||"N/A"}"`,`"${e.language||"N/A"}"`,e.started_at,e.completed_at||"",e.status,e.total_score??"",e.percentage??"",e.meets_benchmark?"Yes":"No",`"${e.provisional_level||""}"`,`"${e.strongest_skill||""}"`].join(",")),t=["Session ID,State,City,Language,Started At,Completed At,Status,Score,Percentage,Meets Benchmark,Provisional Level,Strongest Skill",...e].join("\n");return new i.NextResponse(t,{headers:{"Content-Type":"text/csv","Content-Disposition":'attachment; filename="anonymized_literacy_data.csv"'}})}return i.NextResponse.json({success:!0,count:r.length,data:r})}catch(e){return i.NextResponse.json({success:!1,error:e.message},{status:500})}}let u=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/export/route",pathname:"/api/admin/export",filename:"route",bundlePath:"app/api/admin/export/route"},resolvedPagePath:"C:\\dev\\survey\\src\\app\\api\\admin\\export\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:_}=u,x="/api/admin/export/route";function v(){return(0,o.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:g})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[276,972,716],()=>s(4924));module.exports=a})();