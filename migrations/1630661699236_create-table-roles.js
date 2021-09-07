/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('roles', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.sql(`   INSERT 
                INTO roles(id, name)
                VALUES
                    (1, 'Admin'),
                    (2, 'User');
            `);
};

exports.down = (pgm) => {
    pgm.dropTable('roles');
};
