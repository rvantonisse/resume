module.exports = {
    date: function (date) {
        if (isDate(date)) {
            return Intl.DateTimeFormat("nl-NL", { dateStyle: "full" }).format(
                date
            );
        }

        return date;
    },
};

function isDate(date) {
    try {
        const isDate = new Date(date);
        return true;
    } catch (error) {
        return false;
    }
}
