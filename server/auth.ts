import passport from "passport";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";

declare global {
  namespace Express {
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: "secretaaasaa",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: false, // Set to false since we're not using HTTPS in development
      sameSite: 'lax',
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

}
