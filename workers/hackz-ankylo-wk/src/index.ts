import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { Bindings } from './binding';
import { api } from './routes';

const app = new Hono<{ Bindings: Bindings }>();
app.use(prettyJSON())
app.notFound((c) => c.json({ message: "Not Found" }, 404));

app.route("/", api)

export default app;
