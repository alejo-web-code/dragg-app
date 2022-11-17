import React, { useState, useEffect } from 'react'
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button
} from '@mui/material';

const SideBarEdits = ({ menus, updatedMenus, item }) => {
  const [initialData, setInitialData] = useState({
    menuName: '',
    linkUrl: '',
    opensNewTab: false
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setInitialData({
      menuName: item?.isChildren ? item.childrenName : item.menuName,
      linkUrl: item?.isChildren ? item.linkUrl : item.menuLink ? item.menuLink : '#',
      opensNewTab: item.opensNewTab || false
    })

    if (item) {
      setIsOpen(true)
    }
  }, [item])

  const [errors, setErrors] = useState({})

  const handleValidation = () => {
    let formIsValid = true;
    let temporaryErrors = {}

    if(!initialData['parent']) {
      formIsValid = false;
      temporaryErrors['menuName'] = "Cannot be empty";
    }

    setErrors(temporaryErrors)
    return formIsValid;
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }

    setInitialData({
      ...initialData,
      [name]: value
    })
  }

  const handleChangeCheck = (e) => {
    setInitialData({
      ...initialData,
      opensNewTab: e.currentTarget.checked
    })
  }

  const handleSubmitMenu = () => {
    if (handleValidation()) {
      setInitialData([
        ...initialData,
      ])
    }
  }

  const saveUpdateItem = () => {
    if (item.isChildren) {
      const parentMenu = menus[item.location[0]]
      const element = parentMenu?.childrens?.[item.location[1]]

      element.childrenName = initialData.menuName
      element.linkUrl = initialData.linkUrl
      element.opensNewTab = initialData.opensNewTab

      updatedMenus([...menus])
    } else {
      console.log(menus)
      const parentMenu = menus[item.location[0]]
      console.log('asdasdsa', parentMenu)
      parentMenu.menuName = initialData.menuName
      parentMenu.menuLink = parentMenu.childrens.length === 0 ? initialData.linkUrl : '#'
      parentMenu.opensNewTab = initialData.opensNewTab

      updatedMenus([...menus])
    }
  }
  
  return (
    <>
      {isOpen && (
        <div className='col-md-3 col-12 mt-0 p-0'>
          <div className='d-flex justify-content-between align-items-center border-bottom border-top p-3'>
            <h2>Properties</h2>
            <i className='fa fa-times' style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div className='bg-white h-100'>
            <div className='col-12 py-3'>
              <TextField
                label="Name"
                color='primary'
                variant="standard"
                name='menuName'
                value={initialData.menuName || ''}
                onChange={handleChange}
              />
            </div>
            <div className='col-12 py-3'>
              <TextField
                label="Link"
                color='primary'
                name='linkUrl'
                value={initialData.linkUrl || ''}
                onChange={handleChange}
                variant="standard"
              />
              {/* <FormLabel sx={{ fontStyle: 'italic' }}>
                If this menu has sub-menus, please set this field as #
              </FormLabel> */}
            </div>
            <div className='col-12'>
              <FormControl>
                <FormControlLabel
                  value={initialData.opensNewTab}
                  className='d-flex'
                  control={
                    <Checkbox
                      checked={initialData.opensNewTab}
                      name='opensNewTab'
                      onChange={handleChangeCheck}
                    />
                  }
                  label='Open in a new tab'
                  labelPlacement='end'
                />
              </FormControl>
            </div>
            <div className='col-12 text-right'>
              <button type="button" class="btn btn-link text-primary" onClick={saveUpdateItem}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SideBarEdits;