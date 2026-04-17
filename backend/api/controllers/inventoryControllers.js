const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseComponentQuery = () => db('components').select('*');

exports.getComponents = async (req,res) => {
  const eiid = req.params.id
  const {serid} = req.query

  async function eeidQ() {
    const out = await baseComponentQuery()
      .where('components.end_item_id', eiid)
    return out
  };

  const eeidResult = await eeidQ();


  async function getHistoryInfo() {
    console.log(`serial id -> ${serid}`)
    const out = await db.raw(`

      SELECT "history_component_current".*
      FROM "history_component_current"
      INNER JOIN "components" ON "history_component_current"."component_id" = "components"."id"
      INNER JOIN "serial_end_items" ON "components"."end_item_id" = "serial_end_items"."end_item_id"
      WHERE "serial_end_items"."id" = ?
      AND "history_component_current"."serial_number" = ?;
      `, [serid, serid]
    );
    return out;
  }

  const historyInfo = await getHistoryInfo();

  const seededResult = async (components, history) => {


    let history_c_ids = [];
    let result = [...components];

    history.map(i => {
      history_c_ids.push(i.component_id)
    })

    const output = async () => {

      for ( const c of components) {

        if ( history_c_ids.includes(c.id) ) {

        const hIndex = history.findIndex(h_i => h_i.component_id === c.id);
        const CIndex = components.findIndex(c_i => c_i.id === c.id);

        result[CIndex].h_id = history[hIndex].id
        // console.log(result[CIndex].h_id)

        if ( history[hIndex].count > 0 ) {

          result[CIndex].count = history[hIndex].count;

        };

        if ( history[hIndex].seen === true ) {

          result[CIndex].seen = true;

        };

        if ( history[hIndex].location ) {

          result[CIndex].location = history[hIndex].location;

        };
      };
    }};

    await output()
    return result
  };

  const historyOut = await seededResult(eeidResult, historyInfo.rows)

  res.status(200).json(historyOut)
};

exports.postComponents = async (req,res) => {

  try {

    const data = req.body

    for ( const obj of data ) {

      const {complete, location, count, component_id, serial_id} = obj;

      const serial_number = Number(serial_id);

      if ( obj.h_id === null || undefined ) {

        const result = await db.raw(`
        INSERT INTO history_component_current ( seen, "location", "count", component_id, serial_number )
        VALUES ( ?, ?, ?, ?, ? );
        `, [ complete, location, count, component_id, serial_number ])

      } else if ( obj.h_id > 0 ) {

        const id = obj.h_id

        const result = await db.raw(`
          UPDATE history_component_current
          SET seen = ?,
            "location" = ?,
            "count" = ?,
            component_id = ?,
            serial_number = ?
          WHERE history_component_current.id = ?
        `, [ complete, location, count, component_id, serial_number, id ])

      }
    }

  res.status(200).json('sucessfully updated tables')

  } catch (e) {
    console.log(e)
    res.status(500).json('server error')

  }

}