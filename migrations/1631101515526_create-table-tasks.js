/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('tasks', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        to_do_id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        status: {
            type: 'boolean',
            notNull: true,
        },
    });

    pgm.addConstraint(
        'tasks',
        'fk_tasks.to_do_id_to_dos.id',
        'FOREIGN KEY(to_do_id) REFERENCES to_dos(id) ON DELETE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropTable('tasks');
};
