import {Session} from 'meteor/session';
import server from '../../../config/server'

const api_server = server.url;
//default
FlowRouter.route('/', {
    action: function() {
    let startTime = new Date()
    checkLoginStatus()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'index',  footer:'mainFooter'});
    let endTime = new Date()
    console.log(`${endTime-startTime} ms`)
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
    checkLoginStatus()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'login',  footer:'mainFooter'});
  }
});

FlowRouter.route('/register', {
    action: function() {
    checkLoginStatus()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'register',  footer:'mainFooter'});
  }
});

FlowRouter.route('/findId', {
    action: function() {
    checkLoginStatus()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'findId',  footer:'mainFooter'});
  }
});

FlowRouter.route('/findPw', {
    action: function() {
    checkLoginStatus()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'findPw',  footer:'mainFooter'});
  }
});

//analysis
FlowRouter.route('/analysisDetail/:dataId', {
    action: function() {
    checkLoginStatus()
    BlazeLayout.reset()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'analysisDetail',  footer:'mainFooter'});
  }
});

FlowRouter.route('/analysisOverall/:dataId', {
    action: function() {
    checkLoginStatus()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'analysisOverall',  footer:'mainFooter'});
  }
});

FlowRouter.route('/myAnalysis', {
    action: function() {
    checkLoginStatus()
    checkJWT()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'myAnalysis',  footer:'mainFooter'});
  }
});

//myPage
FlowRouter.route('/modifyMyInfo', {
    action: function() {
    checkLoginStatus()
    checkJWT()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'modifyMyInfo',  footer:'mainFooter'});
  }
});

FlowRouter.route('/myInfo', {
    action: function() {
    checkLoginStatus()
    checkJWT()
    BlazeLayout.render('defaultTemplate', {header:'mainTopBar', main:'myInfo',  footer:'mainFooter'});
  }
});

function checkJWT(){
  fetch(api_server+"/account/jwt", {
      method: 'post',
      mode: 'cors',
      headers: {
        'x-access-token': localStorage.token
      }
    }).then(result => result.json())
    .then(function (tokenData) {
      if (tokenData.success == false) {
        alert("로그인 정보가 잘못되었습니다. 다시 로그인 해주세요.")
        localStorage.token =""
        FlowRouter.go("/")
      }
    })
    .catch(() => {})
}

function checkLoginStatus() {
  if(localStorage.token){
      fetch(api_server+"/account/jwt", {
          method: 'post',
          mode: 'cors',
          headers: {
            'x-access-token': localStorage.token
          }
        }).then(result => result.json())
        .then(function (tokenData) {
          if (tokenData.success == false) Session.set('status', null)
          else Session.set("status", "login")
        })
        .catch(() => Session.set('status', null))
  }
}
