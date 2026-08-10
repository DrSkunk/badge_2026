"""Build the MkDocs nav from nav.yml.

The sidebar menu lives in nav.yml (repo root) so that the Decap CMS "Menu"
collection can edit it. nav.yml only defines the order and the sections;
menu labels come from each page's own frontmatter title (title in
<page>.nl.md for the Dutch site, <page>.en.md for the English site).
A page item can override those with title_nl / title_en.

Dutch is the default locale, so the Dutch title becomes the nav label and
differing English titles are injected into the mkdocs-static-i18n
nav_translations for the en locale.
"""

import os

import yaml


def _frontmatter_title(docs_dir, page, locale):
    path = os.path.join(docs_dir, f"{page}.{locale}.md")
    try:
        with open(path, encoding="utf-8") as handle:
            text = handle.read()
    except OSError:
        return None
    if not text.startswith("---"):
        return None
    try:
        meta = yaml.safe_load(text.split("---", 2)[1])
    except (yaml.YAMLError, IndexError):
        return None
    title = (meta or {}).get("title")
    return str(title).strip() if title else None


def on_config(config):
    root = os.path.dirname(config["config_file_path"])
    nav_path = os.path.join(root, "nav.yml")
    docs_dir = config["docs_dir"]
    with open(nav_path, encoding="utf-8") as handle:
        menu = (yaml.safe_load(handle) or {}).get("menu") or []
    if not menu:
        # Empty or missing menu (e.g. a bad CMS save): keep MkDocs'
        # automatic nav instead of shipping an empty sidebar.
        return config

    translations = {}

    def label_for(item):
        if "page" in item:
            page = item["page"]
            title_nl = (item.get("title_nl") or "").strip() \
                or _frontmatter_title(docs_dir, page, "nl")
            title_en = (item.get("title_en") or "").strip() \
                or _frontmatter_title(docs_dir, page, "en")
        else:  # section: no page behind it, titles live in nav.yml
            title_nl = (item.get("title_nl") or "").strip()
            title_en = (item.get("title_en") or "").strip()
        title_nl = title_nl or title_en or item.get("page", "?")
        if title_en and title_en != title_nl:
            translations[title_nl] = title_en
        return title_nl

    def page_entry(item):
        return {label_for(item): f"{item['page']}.md"}

    nav = []
    for item in menu:
        if item.get("type") == "section" or "pages" in item:
            nav.append({label_for(item): [page_entry(p) for p in item["pages"]]})
        else:
            nav.append(page_entry(item))
    config["nav"] = nav

    i18n = config["plugins"].get("i18n")
    if i18n and translations:
        for language in i18n.config["languages"]:
            if language["locale"] == "en":
                merged = dict(language["nav_translations"] or {})
                merged.update(translations)
                language["nav_translations"] = merged

    config["watch"].append(nav_path)
    return config
