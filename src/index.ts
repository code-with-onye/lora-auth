#!/usr/bin/env node
import { select } from "@inquirer/prompts";
import { initNextAuth } from "./utils";
import { initBasicAuth } from "./utils/basic-auth";

async function runCLI() {
  const answer = await select({
    message: "Select what auth to setup",
    choices: [
      {
        name: "basic-auth",
        value: "auth",
      },
      {
        name: "next-auth",
        value: "next-auth",
      },
    ],
  });

  if (answer === "auth") {
    await initBasicAuth();
  } else if (answer === "next-auth") {
    await initNextAuth();
  } else {
    console.log("Invalid choice");
  }
}

runCLI();
