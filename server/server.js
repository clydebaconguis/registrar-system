import express from "express";
import { db } from "./db.js";
import cors from "cors";
import adminAuthRoutes from "../server/admin/adminRoutes/adminAuth.js";
import adminRequestRoutes from "../server/admin/adminRoutes/adminRequest.js";
import adminStatusRoutes from "../server/admin/adminRoutes/adminStatus.js";
import signatoriesAuthRoutes from "./signatories/signatoriesRoutes/signatoriesAuth.js";
import signatoriesRequestRoutes from "./signatories/signatoriesRoutes/signatoriesRequest.js";
import signatoriesStatusRoutes from "./signatories/signatoriesRoutes/signatoriesStatus.js";
import superAdminAuthRoutes from "./superadmin/superadminRoutes/superadminAuth.js";
import superAdminRequestRoutes from "./superadmin/superadminRoutes/superadminRequest.js";
import superAdminStatusRoutes from "./superadmin/superadminRoutes/superadminStatus.js";
import authRoutes from "./userRoutes/auth.js";
import requestRoutes from "./userRoutes/requests.js";
import usersRoutes from "./userRoutes/users.js";
import statusRoutes from "./userRoutes/status.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
const port = process.env.PORT || 3001;
const app = express();
//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://registar-online-apointment-new.onrender.com",
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const userSessionMiddleware = session({
  key: "user",
  secret: "jwtkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 1000, // expires in 1 hour
  },
});

const adminSessionMiddleware = session({
  key: "admin",
  secret: "admin_jwtkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 1000, // expires in 1 hour
  },
});

const signatoriesSessionMiddleware = session({
  key: "signatories",
  secret: "signatories_jwtkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 1000,
  },
});

const superAdminSessionMiddleware = session({
  key: "superadmin",
  secret: "superadmin_jwtkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 1000,
  },
});

const SelectAllElements = (id) => {
  return new Promise((resolve, reject) => {
    const q =
      "SELECT Student_ID ,Student_firstName FROM student_form WHERE Student_userID = ?";

    db.query(q, [id], (error, elements) => {
      if (error) {
        return reject(error);
      }
      console.log(elements);
      return resolve(elements);
    });
  });
};

app.use("/api/auth", userSessionMiddleware, authRoutes);
app.use("/api/request", userSessionMiddleware, requestRoutes);
app.use("/api/user", userSessionMiddleware, usersRoutes);
app.use("/api/status", userSessionMiddleware, statusRoutes);

app.use("/api/admin/auth", adminSessionMiddleware, adminAuthRoutes);
app.use("/api/admin/request", adminSessionMiddleware, adminRequestRoutes);
app.use("/api/admin/status", adminSessionMiddleware, adminStatusRoutes);

app.use(
  "/api/signatories/auth",
  signatoriesSessionMiddleware,
  signatoriesAuthRoutes
);
app.use(
  "/api/signatories/request",
  signatoriesSessionMiddleware,
  signatoriesRequestRoutes
);
app.use(
  "/api/signatories/status",
  signatoriesSessionMiddleware,
  signatoriesStatusRoutes
);

app.use(
  "/api/superadmin/auth",
  superAdminSessionMiddleware,
  superAdminAuthRoutes
);
app.use(
  "/api/superadmin/request",
  superAdminSessionMiddleware,
  superAdminRequestRoutes
);
app.use(
  "/api/superadmin/status",
  superAdminSessionMiddleware,
  superAdminStatusRoutes
);

// end of routes
app.listen(port || 3001, () => {
  console.log(`app is listining at https:${port}`);
});
