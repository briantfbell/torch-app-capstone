const rawModels = require('../models/rawModels');

exports.createRaw = async (
  {
    name_first: users_data_name_first,
    name_last: users_data_name_last,
    email: users_data_email,
    phone: users_data_phone,
    rank: users_data_rank,
    uic_id: users_data_uic_id,
    role: users_data_role,
    dodid: users_data_dodid,
  },
  { uic: uics_uic, unit_name: uics_unit_name, parent_uic: uics_parent_uic },
  {
    fsc: end_items_fsc,
    description: end_items_description,
    niin: end_items_niin,
    image: end_items_image,
    auth_qty: end_items_auth_qty,
    lin: end_items_lin,
  },
  {
    niin: components_niin,
    description: components_description,
    ui: components_ui,
    auth_qty: components_auth_qty,
    image: components_image,
    arc: components_arc,
    end_item_id: components_end_item_id,
  },
  {
    item_id: serial_items_item_id,
    serial_number: serial_items_serial_number,
    user_id: serial_items_user_id,
    status: serial_items_status,
  },
) => {
  return await rawModels.createRaw({
    users: {
      users_data_name_first,
      users_data_name_last,
      users_data_email,
      users_data_phone,
      users_data_rank,
      users_data_uic_id,
      users_data_role,
      users_data_dodid,
    },
    uics: {
      uics_uic,
      uics_unit_name,
      uics_parent_uic,
    },
    endItems: {
      end_items_fsc,
      end_items_description,
      end_items_niin,
      end_items_image,
      end_items_auth_qty,
      end_items_lin,
    },
    components: {
      components_niin,
      components_description,
      components_ui,
      components_auth_qty,
      components_image,
      components_arc,
      components_end_item_id,
    },
    serialItems: {
      serial_items_item_id,
      serial_items_serial_number,
      serial_items_user_id,
      serial_items_status,
    },
  });
};
