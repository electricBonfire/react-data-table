## DataTable Component For React

### Installation

`npm install northrop.io-data-table`

### Usage

```
import DataTable from 'northrop.io-data-table'

export default const Component = props => {

  const handleEdit = (row) => {
    ...
  }
  
  const onRowClick = (row) => {
    ...
  }

  const rows = [
    {
      firstname: "Jimmy",
      lastname: "Jazz",
      genre: "Blues"
    },
    { ... }
  ]

  const data = {
    headers: [
      "fullname",
      "genre"
    ],
    values: {
      fullname: (row) => {
        return row.firstname + " " + row.lastname  
      }
    },
    //batchActions: {} (Coming Soon) add this key to enable checkboxes
    actions {
      edit: <button onClick={handleEdit}>Edit</button>
    },
    rows: data
  }

  return (
    <DataTable data={data} onRowClick={onRowClick}/>
  )
}
```
