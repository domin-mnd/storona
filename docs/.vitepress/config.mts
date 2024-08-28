import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Storona",
  description: "Simple opinionated file-based router",
  themeConfig: {
    logo: {
      light: "/storona-light.svg",
      dark: "/storona-dark.svg",
    },
    nav: [
      {
        text: "Guide",
        activeMatch: "/guide/",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Quick Start", link: "/guide/quick-start" },
        ],
      },
      {
        text: "Reference",
        link: "/reference/config.html",
        activeMatch: "/reference/",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/guide/introduction" },
            { text: "Quick Start", link: "/guide/quick-start" },
          ],
        },
        {
          text: "Routing",
          items: [
            { text: "Templates", link: "/guide/routing/templates" },
            { text: "Wildcards", link: "/guide/routing/wildcards" },
            { text: "Methods", link: "/guide/routing/methods" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [{ text: "Config", link: "/reference/config" }],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/domin-mnd/storona",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present domin-mnd",
    },

    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    editLink: {
      pattern:
        "https://github.com/domin-mnd/storona/edit/master/docs/:path",
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      { property: "og:image", content: "/preview-banner.png" },
    ],
    [
      "meta",
      {
        property: "og:title",
        content: "Storona",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Simple opinionated file-based routing for your JavaScript applications.",
      },
    ],
    [
      "meta",
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  ],
  lastUpdated: true,
});
