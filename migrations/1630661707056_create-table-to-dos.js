/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('to_dos', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        description: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint(
        'to_dos',
        'fk_to_dos.user_id_users.id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropTable('to_dos');
};
