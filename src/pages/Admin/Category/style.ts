import styled from 'styled-components'

const CategoryStyle = styled.div`
  .table {
    margin-top: 24px;

    .editable-cell {
      position: relative;
    }

    .editable-cell-value-wrap {
      padding: 5px 12px;
      cursor: pointer;
    }

    .editable-row:hover .editable-cell-value-wrap {
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      padding: 4px 11px;
    }
  }
`

const IconStyle = `
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
`

const EditableInputStyle = styled.div`
  position: relative;

  .check {
    ${IconStyle}
    right: 10px;
  }

  .close {
    ${IconStyle}
    right: 10px;
  }
`

export {
  CategoryStyle,
  EditableInputStyle
}
