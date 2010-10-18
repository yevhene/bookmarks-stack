var extensionsBookmarksFolderName = 'Extensions Bookmarks';
var pushPullFolderName = 'Bookmarks Stack';

var pushPullBookmarksFolderID = null;

function findOrCreateExtensionsBookmarksFolder (node, callback) {
    for(i in node.children) {
        if(node.children[i].title == extensionsBookmarksFolderName) {
            callback(node.children[i]);
            return;
        }
    }
    // If not found create folder.
    chrome.bookmarks.create({
            parentId : node.id,
            title    : extensionsBookmarksFolderName
        },
        callback
    );
}

function findorCreatePushPullBookmarksFolder (node, callback) {
    for(i in node.children) {
        if(node.children[i].title == pushPullFolderName) {
            callback(node.children[i]);
            return;
        }
    }
    // If not found create folder.
    chrome.bookmarks.create({
            parentId : node.id,
            title    : pushPullFolderName
        },
        callback
    );
}

function findFolderAndCall (callback) {
    chrome.bookmarks.getTree(function (tree) {
        findOrCreateExtensionsBookmarksFolder(
            tree[0].children[1],
            function (extensionsBookmarkFolder) {
                findorCreatePushPullBookmarksFolder(
                    extensionsBookmarkFolder,
                    function (pushPullBookmarksFolder) {
                        pushPullBookmarksFolderID = pushPullBookmarksFolder.id;
                        callback(pushPullBookmarksFolder);
                    }
                );
            }
        );
    });
}

function checkFolderAndCall (callback) {
    if(pushPullBookmarksFolderID) {
        chrome.bookmarks.get(
            pushPullBookmarksFolderID,
            function (results) {
                if(!results || results.length == 0) {
                    findFolderAndCall(callback);
                    return;
                }
                callback(results[0]);
            }
        );
    } else {
        findFolderAndCall(callback);
    }
}


