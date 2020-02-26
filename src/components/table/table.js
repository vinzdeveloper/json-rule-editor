import React, {Component} from 'react';
import PropTypes from 'prop-types';


class Table extends Component {

    render() {
        const { columns } = this.props;

        return (<table className="table">
            <tbody>
                <tr>
                {columns.map(value => (
                    <th key={value}>{value}</th>
                ))}
                </tr>
                {this.props.children}
            </tbody>
        </table>)
    }
}

Table.defaultProps = ({
    columns: [],
    children: undefined,
});

Table.propTypes = ({
   columns: PropTypes.array,
   children: PropTypes.any,
});

export default Table;