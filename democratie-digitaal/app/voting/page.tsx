import { redirect } from "next/navigation";

export default function VotingRedirectPage() {
    redirect("/vote");
}
