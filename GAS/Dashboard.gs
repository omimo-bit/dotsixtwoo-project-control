function getDashboard_(user){var projects=listRows_('PROJECTS'),tasks=listRows_('TASKS'),meetings=getMeetings_(),budget=getBudget_(),mine=tasks.filter(function(t){return String(t.picEmail||'').toLowerCase()===String(user.email).toLowerCase()||String(t.pic||'').toLowerCase()===String(user.name).toLowerCase()}),today=new Date();today.setHours(0,0,0,0);var tkey=Utilities.formatDate(today,appTimeZone_(),'yyyy-MM-dd');var overdue=tasks.filter(function(t){var d=t.deadline?new Date(t.deadline):null;return d&&d<today&&t.status!=='Completed'});var risky={};overdue.forEach(function(t){risky[t.projectId]=1});tasks.filter(function(t){return t.status==='Blocked'}).forEach(function(t){risky[t.projectId]=1});return{totalProjects:projects.length,myTasks:mine.filter(function(t){return t.status!=='Completed'}).length,overdueTasks:mine.filter(function(t){var d=t.deadline?new Date(t.deadline):null;return d&&d<today&&t.status!=='Completed'}).length,momPending:meetings.filter(function(m){return m.momStatus==='Pending'}).length,todayMeetings:meetings.filter(function(m){return String(m.date||'')===tkey&&String(m.status)!=='Cancelled'}).length,blockedTasks:tasks.filter(function(t){return t.status==='Blocked'}).length,budgetAlerts:budget.filter(function(b){return b.budgetStatus==='ALERT'||b.budgetStatus==='OVER BUDGET'}).length,atRiskProjects:Object.keys(risky).length}}


function getWorkload_(user){
  if(!isManager_(user))throw new Error('Tidak memiliki akses workload');
  var users=listRows_('USERS').filter(function(u){return String(u.active).toLowerCase()!=='false'});
  var tasks=listRows_('TASKS');
  var today=new Date();today.setHours(0,0,0,0);
  return users.map(function(u){
    var mine=tasks.filter(function(t){
      return String(t.picEmail||'').toLowerCase()===String(u.email||'').toLowerCase() ||
             String(t.pic||'').toLowerCase()===String(u.name||'').toLowerCase();
    });
    var active=mine.filter(function(t){return String(t.status)!=='Completed'});
    var enriched=active.map(function(t){
      var d=t.deadline?new Date(t.deadline):null;
      var overdue=!!(d&&!isNaN(d)&&d<today&&String(t.status)!=='Completed');
      var x={};Object.keys(t).forEach(function(k){x[k]=t[k]});x.overdue=overdue;return x;
    });
    return {
      userId:u.userId,
      name:u.name,
      role:u.role,
      active:active.length,
      notStarted:active.filter(function(t){return t.status==='Not Started'}).length,
      onProgress:active.filter(function(t){return t.status==='On Progress'}).length,
      waiting:active.filter(function(t){return t.status==='Waiting'}).length,
      blocked:active.filter(function(t){return t.status==='Blocked'}).length,
      overdue:enriched.filter(function(t){return t.overdue}).length,
      completed:mine.filter(function(t){return t.status==='Completed'}).length,
      tasks:enriched
    };
  });
}
