// Composables
import { useQuestionnaireStore } from "@/store/questionnaire";
import { useRespondentStore } from "@/store/respondent";
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
//@ts-ignore
import nprogress from "nprogress";
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/questionnaires/:questionnaire_id",
        //@ts-ignore
        component: () => import("@/views/Questionnaire/Show.vue"),
        name: "questionnaire.show",
        //@ts-ignore
        beforeEnter: (to, from, next) => {
          const $questionnaire = useQuestionnaireStore();
          return $questionnaire.get(to.params.questionnaire_id).then(() => {
            return next();
          }).catch((err) => {
            return next({name: 'NotFound'})
          });
        },
        redirect: { name: "questionnaire.show.summary" },
        children: [
          {
            path: "summary",
            //@ts-ignore
            component: () => import("@/views/Questionnaire/Show/Summary.vue"),
            name: "questionnaire.show.summary",
          },
          {
            path: "analyze-individual",
            //@ts-ignore
            component: () => import("@/views/Questionnaire/Show/Individual.vue"),
            name: "questionnaire.show.individual",
            //@ts-ignore
            beforeEnter: (to, from, next) => {
              const $questionnaire = useQuestionnaireStore()

              return $questionnaire.get_response(to.query.page || 1).then(() => {
                return next()
              }).catch(() => next({name: 'questionnaire.show'}))
            }
          },
          {
            path: "design",
            //@ts-ignore
            component: () => import("@/views/Questionnaire/Show/Design.vue"),
            name: "questionnaire.show.design",
          },
          {
            path: "configure",
            //@ts-ignore
            component: () => import("@/views/Questionnaire/Show/Configure.vue"),
            name: "questionnaire.show.configure",
          },
        ],
      },
    ],
  },
  {
    path: "/AZUWQE13MFA",
    //@ts-ignore
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Auth/Login.vue"),
    name: "Login",
  },
  {
    path: "/response/questionnaires/:questionnaire_id",
    name: "responses",
    //@ts-ignore
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Response.vue"),
    redirect: { name: "response.index" },
    //@ts-ignore
    beforeEnter(to, from, next) {
      const $respondent = useRespondentStore();
      const { response, questionnaire } = storeToRefs(useRespondentStore());
      const local_response = JSON.parse(
        sessionStorage.getItem("response." + to.params.questionnaire_id) || "{}"
      );

      const local_questionnaire = JSON.parse(
        sessionStorage.getItem("questionnaire." + to.params.questionnaire_id) ||
          "{}"
      );

      if (Object.keys(local_response).length > 0) {
        if (local_response.questionnaire_id == to.params.questionnaire_id) {
          response.value = local_response;
        }
      }

      if (
        Object.keys(local_questionnaire).length > 0 &&
        local_questionnaire.id == to.params.questionnaire_id
      ) {
        questionnaire.value = local_questionnaire;

        return next();
      }

      $respondent
        .getQuestionnaire(to.params.questionnaire_id)
        .then(() => {
          return next();
        })
        .catch(() => {
          return next("/");
        });
    },
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/Response/Index.vue"),
        name: "response.index",
        //@ts-ignore
        beforeEnter(to, from, next) {
          const { response } = storeToRefs(
            useRespondentStore()
          );

          if(Object.keys(response.value).length < 1){
            return next()
          }

          return next({name: 'response.options', params: {questionnaire_id: to.params.questionnaire_id}});
        },
        meta: {
          transition: "scale",
        },
      },
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/Response/ResponseOptions.vue"),
        name: "response.options",
        //@ts-ignore
        beforeEnter(to, from, next) {
          const { response } = storeToRefs(
            useRespondentStore()
          );

          if(response.value){
            return next()
          }

          return next({name: 'response.index', params: {questionnaire_id: to.params.questionnaire_id}});
        },
        meta: {
          transition: "scale",
        },
      },
      {
        path: "question/:question_id",
        //@ts-ignore
        component: () =>
          import(
            /* webpackChunkName: "question" */ "@/views/Response/Question.vue"
          ),
        name: "response.question",
        //@ts-ignore
        beforeEnter(to, from, next) {
          const { questionnaire, question, hasResponseIdentity, response } = storeToRefs(useRespondentStore());
          const exists = questionnaire.value.questions[to.params.question_id - 1];

          if (response.value && response.value.submitted_at) {

            return next({
              name: "response.success",
              params: { questionnaire_id: questionnaire.value.id },
            });
          }

          if (exists && Object.keys(response.value).length > 0) {
            question.value = exists;
            return next();
          }

          return next({
            name: "response.index",
            params: { questionnaire_id: to.params.questionnaire_id },
          });
        },
        meta: {
          transition: "slide",
        },
      },
      {
        path: "review",
        //@ts-ignore
        component: () =>
          import(
            /* webpackChunkName: "response.review" */ "@/views/Response/Review.vue"
          ),
        name: "response.review",
        //@ts-ignore
        beforeEnter(to, from, next) {
          const { hasResponseIdentity, response, questionnaire } = storeToRefs(
            useRespondentStore()
          );

          if (hasResponseIdentity && response.value.submitted_at) {
            return next({
              name: "response.success",
              params: { questionnaire_id: questionnaire.value.id },
            });
          }

          if (hasResponseIdentity.value) {
            return next();
          }

          return next({
            name: "response.index",
            params: { questionnaire_id: to.params.questionnaire_id },
          });
        },
        meta: {
          transition: "slide-up",
        },
      },
      {
        path: "successfully",
        //@ts-ignore
        component: () =>
          import(
            /* webpackChunkName: "response.succesfully" */ "@/views/Response/SuccessResponse.vue"
          ),
        name: "response.success",
        //@ts-ignore
        beforeEnter(to, from, next) {
          const { response, questionnaire } = storeToRefs(useRespondentStore());
          if (response.value && response.value.submitted_at) {
            return next();
          }
          return next({
            name: "response.index",
            params: { questionnaire_id: questionnaire.value.id },
          });
        },
        meta: {
          transition: "scale",
        },
      },
      {
        path: "result",
        //@ts-ignore
        component: () =>
          import(
            /* webpackChunkName: "response.result" */ "@/views/Response/Result.vue"
          ),
        name: "response.result",
        //@ts-ignore
        beforeEnter(to, from, next) {
          const { response, questionnaire, times_up } = storeToRefs(
            useRespondentStore()
          );

          if (response.value && response.value.submitted_at && times_up.value) {
            return next();
          }
          return next({
            name: "response.index",
            params: { questionnaire_id: questionnaire.value.id },
          });
        },
        meta: {
          transition: "scale",
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    //@ts-ignore
    component: () => import('@/views/utility/NotFound.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from, next) => {
  nprogress.done();
});

router.beforeEach((to, from, next) => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  nprogress.configure({ showSpinner: false });

  nprogress.start();
  if (to.meta.requiresAuth && Object.keys(userData).length < 1) {
    return next({ name: "Login" });
  }

  return next();
});

export default router;
