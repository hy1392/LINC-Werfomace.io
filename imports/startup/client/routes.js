//default
FlowRouter.route('/', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'index',  footer:'mainFooter'});
  },
});

FlowRouter.notFound = {
    action: function() {
    alert("404!");
    location.href="/";
  }
};


//account
FlowRouter.route('/login', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'login',  footer:'mainFooter'});
  }
});

FlowRouter.route('/register', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'register',  footer:'mainFooter'});
  }
});

FlowRouter.route('/findId', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'findId',  footer:'mainFooter'});
  }
});

FlowRouter.route('/findPw', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'findPw',  footer:'mainFooter'});
  }
});

//analysis
FlowRouter.route('/analysisDetail', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'analysisDetail',  footer:'mainFooter'});
  }
});

FlowRouter.route('/myAnalysis', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'myAnalysis',  footer:'mainFooter'});
  }
});

//myPage
FlowRouter.route('/modifyMyInfo', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'modifyMyInfo',  footer:'mainFooter'});
  }
});

FlowRouter.route('/myInfo', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'myInfo',  footer:'mainFooter'});
  }
});
