import Vue from 'vue'
import VueRouter from 'vue-router'
import commtend from './routers/commtend'
import whole from './routers/whole'
import cultivation from './routers/cultivation'
import watchHistory from './routers/watchHistory'
import disease from './routers/disease'
import diseaseList from './routers/diseaseList'
import proadcast from './routers/proadcast'
import proadcastcopy from './routers/proadcastcopy'
import proadcastcopy1 from './routers/proadcastcopy1'
import homepage from './routers/homepage'
import more from './routers/more'
import info from './routers/info'
import jump from './routers/jump'
import collect from './routers/collect'
Vue.use(VueRouter)
const routes = [

	{
		path: '/', redirect: '/jump'
	},
	...commtend,
	jump,
	whole,
	cultivation,
	disease,
	diseaseList,

	proadcast,
	proadcastcopy,
	proadcastcopy1,
	homepage,
	more,
	info,
	watchHistory,
	collect

]
const router = new VueRouter({
	mode: 'history',
	routes
})
router.beforeEach((to, from, next) => {

	next()
})
export default router


