export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/reservation/index',
    'pages/checkin/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/device-detail/index',
    'pages/submit-reservation/index',
    'pages/checkout-feedback/index',
    'pages/audit/index',
    'pages/schedule/index',
    'pages/favorites/index',
    'pages/records/index',
    'pages/appeal/index',
    'pages/credit-detail/index',
    'pages/team-management/index',
    'pages/notifications/index',
    'pages/settings/index',
    'pages/about/index',
    'pages/help/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2563EB',
    navigationBarTitleText: '实验室预约',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#64748B',
    selectedColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/reservation/index',
        text: '预约'
      },
      {
        pagePath: 'pages/checkin/index',
        text: '签到'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
