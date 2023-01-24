module.exports = class GitLabPublisher {
    constructor({ gitlabAdapter, loggerService }) {
        this.gitlabAdapter = gitlabAdapter;
        this.logger = loggerService;
    }
    async publish({ projectId, tag, content, assetFileUrl }) {
        let assets = {};
        if (assetFileUrl !== null) {
            assets = {
                links: [
                    {
                        name: "Compiled file",
                        url: assetFileUrl,
                        direct_asset_path: "/binaries/windows-amd64",
                        link_type: "package"
                    }
                ]
            };
        }
        if (tag?.release?.description) {
            this.logger.debug(`Updating the release note`);
            await this.gitlabAdapter.updateTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, {
                description: content,
                assets
            });
        } else {
            this.logger.debug(`Creating a new release note`);
            await this.gitlabAdapter.createTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, {
                description: content,
                assets
            });
        }
    }
};
