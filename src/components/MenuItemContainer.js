import React from 'react'

const MenuItemContainer = ({
    label,
    className,
    deleteElemnt = () => {},
    editElement = () => {},
    hasChildrens = false,
    toggleMenuChildrens = () => {},
    showSubMenus = true,
    draggClass = ''
}) => {
    return (
        <div className='d-flex align-items-center justify-content-end position-relative'>
            {hasChildrens && (
                <div className='mr-3 position-absolute' onClick={toggleMenuChildrens} style={{ left: showSubMenus ? '-30px' : '-25px' }}>
                    <i className={`fas fa-caret-${showSubMenus ? 'down' : 'right'}`} style={{ fontSize: '32px', cursor: 'pointer' }}/>
                </div>
            )}
            <div className={`bg-white col p-3 shadow rounded m-0 d-flex justify-content-between align-items-center ${className}`}>
                <p className='mb-0'>{label || ''}</p>
                <i className={`fas fa-grip-horizontal align-self-center text-secondary ml-2 icon-drag ${draggClass}`} style={{ fontSize: '22px' }}/>
            </div>
            <div className='ml-3' onClick={editElement}>
                <i className='fa fa-edit' style={{ fontSize: '18px', cursor: 'pointer' }}/>
            </div>
            <div className='ml-3' onClick={deleteElemnt}>
                <i className='far fa-trash-alt text-danger' style={{ fontSize: '18px', cursor: 'pointer' }}/>
            </div>
        </div>
    )
}

export default MenuItemContainer;