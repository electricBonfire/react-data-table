import React from 'react';

class DataTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sortBy: null,
            sortDirection: 0,
            selectedRows: [],
            selectAll: false
        };
    }

    sortBy(field) {
        let {sortBy, sortDirection} = this.state;

        if (field === sortBy) {
            if (sortDirection === 0) {
                sortDirection = 1
            } else if (sortDirection === 1) {
                sortDirection = -1
            } else {
                sortDirection = 0
            }
        } else {
            sortDirection = 1
        }

        this.setState({
            sortBy: field,
            sortDirection
        })
    }

    onToggleRowSelectAll() {
        let selectedRows = [];
        let selectAll = false;

        if (!this.state.selectAll) {
            selectAll = true;
            selectedRows = this.props.data.rows.map((row) => {
                return row.id
            });
        }

        this.setState({
            selectAll,
            selectedRows
        });
    }

    onToggleRowSelect(rowId) {
        let {selectedRows} = this.state;
        if (selectedRows.includes(rowId)) {
            selectedRows = selectedRows.filter((row) => {
                return row !== rowId;
            })
        } else {
            selectedRows.push(rowId);
        }

        this.setState({
            selectedRows
        });
    }

    renderField(row, field) {
        const {values} = this.props.data;

        if (values && values[field]) {
            if (typeof values[field] === "function") {
                return values[field](row)
            }
        }

        if (row[field] instanceof Object) {
            return row[field].toString();
        } else {
            return row[field];
        }
    }

    onRowClick(row) {
        if (this.props.onRowClick) {
            this.props.onRowClick(row);
        }
    }

    render() {
        const {data} = this.props;
        if (!data) {
            return null
        }

        const rows = this.props.data.rows ? this.props.data.rows.map((row) =>
            ({...row, isSelected: false})
        ) : null;


        if (this.state.sortBy) {
            rows.sort((a, b) => {
                const aVal = this.renderField(a, this.state.sortBy);
                const bVal = this.renderField(b, this.state.sortBy);

                if (!aVal && !bVal) {
                    return 0
                } else if (!aVal) {
                    return this.state.sortDirection
                } else if (!bVal) {
                    return -this.state.sortDirection
                }


                if (this.renderField(a, this.state.sortBy).toLowerCase() > this.renderField(b, this.state.sortBy).toLowerCase()) {
                    return this.state.sortDirection;
                } else {
                    return -this.state.sortDirection;
                }
            });
        }

        let actions = (data && data.actions) ? Object.keys(data.actions) : null;
        let batchActions = (data && data.batchActions) ? Object.keys(data.batchActions) : null;

        return (
            <table>
                <thead>
                <tr>
                    {batchActions && <th><label><input type="checkbox" checked={this.state.selectAll}
                                                       onChange={this.onToggleRowSelectAll.bind(this)}/><span/></label>
                    </th>}
                    {data && data.headers.map((field) => (
                        <th key={field}
                            onClick={() => this.sortBy(field)}>{field.charAt(0).toUpperCase() + field.substr(1)}</th>
                    ))}
                    {actions && <td>Actions</td>}
                </tr>
                </thead>
                <tbody>
                {rows && rows.map((row) => {
                    return (
                        !row.id ? null :
                            <tr key={row.id}>
                                {batchActions &&
                                <td>
                                    <label>
                                        <input type="checkbox"
                                               onChange={(e) => this.onToggleRowSelect(row.id)}
                                               checked={this.state.selectedRows.includes(row.id)}/>
                                        <span/>
                                    </label>
                                </td>
                                }

                                {data.headers.map((field) => {
                                    return (
                                        <td key={`${row.id}-${field}`} onClick={() => this.onRowClick(row)}>
                                            {this.renderField(row, field)}
                                        </td>
                                    )
                                })}

                                {actions &&
                                <td>
                                    {actions.map((action) => (
                                        <button key="action"
                                                onClick={() => this.props.data.actions[action](row)}>{action}</button>
                                    ))}
                                </td>
                                }
                            </tr>
                    )
                })}
                </tbody>
            </table>
        );
    }
}

export default DataTable;