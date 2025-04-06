import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("level/:levelId", "routes/level.tsx")
] satisfies RouteConfig;
