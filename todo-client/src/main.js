import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./apollo";

import App from "./App.vue";
const store = createPinia();
const app = createApp(App);

app.provide(DefaultApolloClient, apolloClient);
app.use(store);

app.mount("#app");

