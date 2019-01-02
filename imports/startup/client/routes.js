import {Session} from 'meteor/session';
//default
FlowRouter.route('/', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'index',  footer:'mainFooter'});
  },
});

FlowRouter.notFound = {
    action: function() {
    alert("404!");
    FlowRouter.go("/")
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
FlowRouter.route('/analysisDetail/:dataId', {
    action: function() {
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'analysisDetail',  footer:'mainFooter'});
  }
});

FlowRouter.route('/myAnalysis', {
    action: function() {
    if (Session.get('id') == null || Session.get('id') == undefined) FlowRouter.go("/")
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'myAnalysis',  footer:'mainFooter'});
  }
});

//myPage
FlowRouter.route('/modifyMyInfo', {
    action: function() {
    if (Session.get('id') == null || Session.get('id') == undefined) FlowRouter.go("/")
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'modifyMyInfo',  footer:'mainFooter'});
  }
});

FlowRouter.route('/myInfo', {
    action: function() {
    if (Session.get('id') == null || Session.get('id') == undefined) FlowRouter.go("/")
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'myInfo',  footer:'mainFooter'});
  }
});
