import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Icon, ShieldMark } from "./icons";
import { TEL_1930 } from "../lib/links";

type BackTarget = "/" | "/call" | "/lost";

export function Page({
  children,
  back,
  showCallLink = true,
}: {
  children: ReactNode;
  back?: { to: BackTarget; label: string };
  showCallLink?: boolean;
}) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="wrap header-row">
          <Link to="/" className="brand" aria-label="ScamShield, go to start">
            <ShieldMark />
            <span>ScamShield</span>
          </Link>
          {showCallLink ? (
            <Link to="/call" className="call-chip">
              <Icon name="phone" size={20} />
              On a call?
            </Link>
          ) : null}
        </div>
      </header>
      {back ? (
        <nav className="wrap back-row" aria-label="Back">
          <Link to={back.to}>
            <Icon name="arrow-left" />
            {back.label}
          </Link>
        </nav>
      ) : null}
      <main id="main" className="wrap main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="footer-lead">
          <Icon name="lock" size={20} />
          <span>Everything runs on this device. Nothing you type is sent or saved.</span>
        </p>
        <p>
          Lost money?{" "}
          <a href={TEL_1930} aria-label="Call 1930, the national cyber-fraud helpline">
            Call 1930
          </a>
          . Free, open all day.
        </p>
        <ul className="footer-links">
          <li>
            <Link to="/rules">Four rules</Link>
          </li>
          <li>
            <Link to="/quiz">Spot the scam</Link>
          </li>
          <li>
            <Link to="/share">Send to family</Link>
          </li>
        </ul>
        <p>Guidance only, not legal advice.</p>
      </div>
    </footer>
  );
}

/** Heading that receives focus on view changes. Exactly one per view. */
export const MAIN_HEADING_ID = "main-heading";
