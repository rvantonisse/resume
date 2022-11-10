const filters = require("./_eleventy/filters.js");

const ENV_DEVELOPMENT = process.env.DEVELOPMENT === "TRUE";

const CONFIG = {
    ROLES_DIR: "werk",
    PROJECTS_DIR: "projecten",
    EDUCATIONS_DIR: "opleiding",
    dir: {
        input: "./content",
        includes: "../_eleventy/_components",
        layouts: "../_eleventy/_layout",
        data: "../_eleventy/_data",
        output: ENV_DEVELOPMENT ? "_development" : "_built",
    },
};

// console.dir(CONFIG);

function sortByStartDate(a, b) {
    const startDateA = a.data.startDate;
    const startDateB = b.data.startDate;

    if (startDateA && startDateB) {
        return startDateB - startDateA;
    }

    return 0;
}

module.exports = function (eleventyConfig) {
    // Add basic info pages
    ["introduction"].forEach(function addCollections(collectionName) {
        eleventyConfig.addCollection(
            collectionName,
            function filteredByCollectionName(collectionAPI) {
                return collectionAPI.getFilteredByTag(collectionName);
            }
        );
    });

    // Add special employers collection with metadata added
    eleventyConfig.addCollection("employers", function (collectionApi) {
        const collection = collectionApi.getAll();

        return ["Accessibility", "Jouw Omgeving", "Zelfstandige"];
    });

    // Add generic collections
    ["roles", "projects", "educations"].forEach(function addEleventyCollection(
        collectionName
    ) {
        eleventyConfig.addCollection(collectionName, function (collectionApi) {
            const collectionDirName = `${collectionName.toUpperCase()}_DIR`;

            return collectionApi
                .getFilteredByGlob(
                    `${CONFIG.dir.input}/${CONFIG[collectionDirName]}/*.md`
                )
                .sort(sortByStartDate);
        });
    });

    // Filters
    for (const filter in filters) {
        eleventyConfig.addFilter(filter, filters[filter]);
    }

    return {
        dir: CONFIG.dir,
    };
};
