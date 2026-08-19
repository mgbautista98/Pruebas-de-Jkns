const fs = require("fs");
const { chromium } = require("@playwright/test");
const { loadConfig } = require("./lib/config");
const {
  buildComment,
  currentDateParts,
  openIssue,
  commentAlreadyExists,
  openCommentEditor,
  fillCommentEditor,
  submitComment
} = require("./lib/jira");

async function main() {
  const config = loadConfig();
  if (!fs.existsSync(config.authFile)) {
    throw new Error(
      `No existe ${config.authFile}. Ejecuta primero "npm run auth".`
    );
  }

  const comment = buildComment(config);
  const dateParts = currentDateParts(config.locale, config.timezone);
  const browser = await chromium.launch({ headless: !config.headed });
  const context = await browser.newContext({ storageState: config.authFile });
  const page = await context.newPage();

  const issueKey = await openIssue(page, config);
  console.log(`Ticket destino: ${issueKey}`);

  if (!config.allowDuplicate && (await commentAlreadyExists(page, dateParts.isoDate))) {
    console.log(`Ya existe un comentario con la marca [${dateParts.isoDate}].`);
    await browser.close();
    return;
  }

  await openCommentEditor(page);
  await fillCommentEditor(page, comment);
  await submitComment(page);

  await page.waitForTimeout(3000);
  console.log(`Comentario publicado en ${issueKey}.`);
  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
