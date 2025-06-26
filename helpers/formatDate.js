'use strict'

function formatDate(date) {
    return date.toISOString().split('T')[0]
}

function getImagePublicId (url) {
    const pathname = url.split('?')[0];
    const parts = pathname.split('/');
    const filename = parts[parts.length - 1];
    return filename;
}

module.exports = {formatDate, getImagePublicId}