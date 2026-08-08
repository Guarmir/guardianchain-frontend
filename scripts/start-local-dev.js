import { spawn } from "node:child_process"

const isWindows =
  process.platform === "win32"

const command = isWindows
  ? process.env.ComSpec || "cmd.exe"
  : "vercel"

const commandArguments = isWindows
  ? [
      "/d",
      "/s",
      "/c",
      "vercel dev",
    ]
  : ["dev"]

console.log(
  "[LOCAL DEV] Starting GuardianChain with .env.local...",
)

let vercelProcess

try {
  vercelProcess = spawn(
    command,
    commandArguments,
    {
      stdio: "inherit",
      env: process.env,
      windowsHide: false,
    },
  )
} catch (error) {
  console.error(
    "[LOCAL DEV] Could not start Vercel:",
    {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    },
  )

  process.exitCode = 1
}

if (vercelProcess) {
  vercelProcess.on(
    "error",
    (error) => {
      console.error(
        "[LOCAL DEV] Vercel process failed:",
        {
          name: error?.name,
          message: error?.message,
          code: error?.code,
        },
      )

      process.exitCode = 1
    },
  )

  vercelProcess.on(
    "exit",
    (exitCode, signal) => {
      if (signal) {
        console.log(
          `[LOCAL DEV] Vercel stopped by signal: ${signal}`,
        )
      }

      if (
        exitCode !== null &&
        exitCode !== 0
      ) {
        console.error(
          `[LOCAL DEV] Vercel finished with code: ${exitCode}`,
        )
      }

      process.exitCode =
        exitCode ?? 0
    },
  )
}