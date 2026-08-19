const fs = require("fs");

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function currentDateParts(locale, timezone) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    isoDate: new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now),
    date: new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now),
    weekday: (map.weekday || "").toLowerCase(),
    month: (map.month || "").toLowerCase(),
    year: map.year || String(now.getFullYear())
  };
}

function buildComment(config) {
  const template = fs.readFileSync(config.templatePath, "utf8");
  const parts = currentDateParts(config.locale, config.timezone);

  return template
    .replaceAll("{date}", parts.date)
    .replaceAll("{iso_date}", parts.isoDate)
    .replaceAll("{weekday}", parts.weekday)
    .replaceAll("{month}", parts.month)
    .replaceAll("{year}", parts.year)
    .replaceAll("{board_url}", config.boardUrl)
    .trim();
}

async function findFirstVisibleIssueLink(page, projectKey) {
  const primary = page.locator(`a[href*="/browse/${projectKey}-"]`).first();
  if (await primary.count()) {
    await primary.waitFor({ state: "visible", timeout: 15000 });
    return primary;
  }

  const fallback = page
    .locator("a[href*='/browse/']")
    .filter({ hasText: new RegExp(`^${escapeRegExp(projectKey)}-\\d+$`) })
    .first();
  await fallback.waitFor({ state: "visible", timeout: 15000 });
  return fallback;
}

async function resolveIssueKey(page, config) {
  if (config.issueKey) {
    return config.issueKey;
  }

  await page.goto(config.boardUrl, { waitUntil: "domcontentloaded" });
  const issueLink = await findFirstVisibleIssueLink(page, config.projectKey);
  const text = (await issueLink.textContent()) || "";
  const match = text.match(new RegExp(`${escapeRegExp(config.projectKey)}-\\d+`));

  if (match) {
    return match[0];
  }

  const href = await issueLink.getAttribute("href");
  const hrefMatch = href && href.match(/\/browse\/([A-Z]+-\d+)/i);
  if (!hrefMatch) {
    throw new Error("No pude resolver el ticket destino desde el board.");
  }
  return hrefMatch[1];
}

async function openIssue(page, config) {
  const issueKey = await resolveIssueKey(page, config);
  const origin = new URL(config.boardUrl).origin;
  await page.goto(`${origin}/browse/${issueKey}`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  return issueKey;
}

async function commentAlreadyExists(page, isoDate) {
  const marker = `[${isoDate}]`;
  const matches = page.getByText(marker, { exact: false });
  return (await matches.count()) > 0;
}

async function openCommentEditor(page) {
  const buttonNames = [
    /add comment/i,
    /comment/i,
    /agregar comentario/i,
    /comentar/i
  ];

  for (const name of buttonNames) {
    const button = page.getByRole("button", { name }).first();
    if (await button.count()) {
      await button.click();
      return;
    }
  }
}

async function fillCommentEditor(page, comment) {
  const editorCandidates = [
    page.locator("[contenteditable='true']").last(),
    page.locator("div[role='textbox']").last(),
    page.locator("textarea").last()
  ];

  for (const editor of editorCandidates) {
    if (await editor.count()) {
      await editor.waitFor({ state: "visible", timeout: 10000 });
      await editor.click();

      const tagName = await editor.evaluate((node) => node.tagName.toLowerCase());
      if (tagName === "textarea") {
        await editor.fill(comment);
      } else {
        await page.keyboard.insertText(comment);
      }
      return;
    }
  }

  throw new Error("No pude encontrar el editor de comentarios en Jira.");
}

async function submitComment(page) {
  const buttonNames = [
    /save/i,
    /comment/i,
    /guardar/i,
    /publicar/i
  ];

  for (const name of buttonNames) {
    const button = page.getByRole("button", { name }).last();
    if (await button.count()) {
      await button.click();
      return;
    }
  }

  throw new Error("No pude encontrar el boton para enviar el comentario.");
}

module.exports = {
  buildComment,
  currentDateParts,
  openIssue,
  commentAlreadyExists,
  openCommentEditor,
  fillCommentEditor,
  submitComment
};
