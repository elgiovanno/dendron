import { getStage, setEnv } from "@dendronhq/common-all";
import fs from "fs-extra";
import path from "path";
import * as vscode from "vscode";
import { Logger, TraceLevel } from "./logger";
import { VSCodeUtils } from "./utils";


// === Main
// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  const ctx = "activate";
  const { logPath, extensionPath, extensionUri, storagePath, globalStoragePath } = context;
  fs.ensureDirSync(context.logPath);
  setEnv("LOG_DST", path.join(context.logPath, "dendron.log"));

  const { DendronWorkspace } = require("./workspace");
  const ws = new DendronWorkspace(context);

  // init logs
  Logger.configure(context, TraceLevel.Debug);
  Logger.debug({ ctx, logPath, extensionPath, extensionUri, storagePath, globalStoragePath });
  ws.L.info({ ctx, logPath, extensionPath, extensionUri, storagePath, globalStoragePath });
  console.log("active", logPath, extensionPath);
  if (DendronWorkspace.isActive()) {
    ws.L.info({ ctx, msg: "isActive" });
    ws.reloadWorkspace().then(() => {
      Logger.debug({ ctx, msg: "engine Initialized" });
    });
  }
  if (VSCodeUtils.isDebuggingExtension() || getStage() === "test") {
    Logger.output?.show(true);
    // TODO: check for cmd
    // const fullLogPath = FileUtils.escape(path.join(logPath, 'dendron.log'));
    // TODO
    // const cmd = `/usr/local/bin/code-insiders ${fullLogPath}`;
    // execa.command(cmd);
    // vscode.window.showInformationMessage(`logs at ${fullLogPath}`);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {
  const ctx = "deactivate";
  const { DendronWorkspace } = require("./workspace");
  DendronWorkspace.instance().L.info({ ctx });
}
