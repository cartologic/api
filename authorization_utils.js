module.exports = {
    INTERNATIONAL_EDITOR: 'international editor',
    NATIONAL_EDITOR: 'national editor',
    ADMIN: 'admin',

    isAuthorizedEditor: function (roles, projectType) {
        return roles.indexOf(this.ADMIN) !== -1 || (roles.indexOf(this.INTERNATIONAL_EDITOR) !== -1 && projectType === 'international') ||
            ((roles.indexOf(this.NATIONAL_EDITOR) !== -1 && projectType === 'national'));
    },
    isAuthorizedReader: function (auth, project) {
        const roles = auth.credentials && auth.credentials.roles || [];
        return this.isAuthorizedEditor(roles, project.type) || // edit access can see everything
        (!project.private && project.published) || // public and published
        (auth.isAuthenticated && project.private && project.published); // also show authorized, private, published
    }
};
