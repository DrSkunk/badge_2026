"""Compatibility shim for MkDocs 1.6 and mkdocs-static-i18n.

mkdocs-static-i18n is currently frozen upstream but still accesses Theme._vars,
which MkDocs 1.6 keeps as a deprecated compatibility alias. Expose that alias
without emitting warnings so local builds stay clean until the docs stack moves
off this plugin. This is due to the release of MkDocs 2.0, which introduces a 
whole new set of problems: https://github.com/ultrabug/mkdocs-static-i18n/issues/342
"""

from mkdocs.theme import Theme


def _theme_vars(self: Theme) -> Theme:
    return self


Theme._vars = property(_theme_vars)
