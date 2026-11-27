# Changelog

Versioning: `YYYY.MM.DD.counter` (e.g. `2026.11.27.1` = first release of 27 Nov 2026).
The value lives in `www/.index_of/footer.html` and matches the git tag (`v2026.11.27.1`).

## 2026.11.27.4
- All code comments (`.htaccess`, `index-of.conf`, CSS, JS, HTML) translated to English.
- Removed the mention of the Apache server signature from the docs.

## 2026.11.27.3
- Footer (version and copyright) is larger and more visible.

## 2026.11.27.2
- Interface in English by default, with Romanian available: **EN / RO** button in the top bar, choice remembered in the browser.
- `DEFAULT_LANG` and the `LANGS` dictionary in `script.js`; a language is added by copying one block.
- Translated: column titles, search placeholder, tooltips, counters, "Folder" and the empty-folder / no-match messages.

## 2026.11.27.1
- First public release.
- Modern replacement for Apache's "Index of" page, switched on from `.htaccess` (`mod_autoindex` + `HTMLTable`).
- Icons per file type, breadcrumbs, instant search, sorting by name / date / size / description, list and grid view.
- Description column after the size (from `AddDescription`); folders show "Folder".
- Light, dark or automatic theme, remembered in the browser.
- Version and copyright in the footer (`footInfo`).
- `apache/index-of.conf`: one `Alias /.index_of` for all virtual hosts (host install and Docker).
