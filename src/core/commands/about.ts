import { profile } from "../../data/profile";

export default {
    description: "About me",
    run: () => `I am ${profile.name}\n${profile.title}\n${profile.description}`
} as any;
