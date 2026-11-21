import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, MAIN_HEADING_ID } from "../ui/chrome";
import { ChoiceInner, FrontDoorCards } from "../ui/parts";
import { Icon } from "../ui/icons";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "ScamShield: help with scam messages and calls" }] }),
  component: Home,
});

function Home() {
  return (
    <Page>
      <h1 id={MAIN_HEADING_ID} tabIndex={-1}>
        What is happening?
      </h1>
      <FrontDoorCards />
      <p className="privacy">
        <Icon name="lock" size={20} />
        <span>Everything runs on this device. Nothing you type is sent or saved.</span>
      </p>

      <h2>Learn and share</h2>
      <ul className="card-list">
        <li>
          <Link to="/quiz" className="choice">
            <ChoiceInner icon="shield" title="Spot the scam" sub="6 messages. Can you tell which are scams?" />
          </Link>
        </li>
        <li>
          <Link to="/rules" className="choice">
            <ChoiceInner icon="info" title="Four rules to remember" sub="Short enough to remember during a call" />
          </Link>
        </li>
        <li>
          <Link to="/share" className="choice">
            <ChoiceInner icon="share" title="Send these rules to family" sub="On WhatsApp, in one tap" />
          </Link>
        </li>
      </ul>
    </Page>
  );
}
