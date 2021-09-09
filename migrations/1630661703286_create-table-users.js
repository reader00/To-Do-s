/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        role_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        username: {
            type: 'TEXT',
            notNull: true,
        },
        email: {
            type: 'TEXT',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint(
        'users',
        'fk_users.role_id_roles.id',
        'FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};
