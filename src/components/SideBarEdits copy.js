import React, { useState, useEffect } from 'react'

const SideBarEdits = ({ menus, setMenus }) => {
  const [subItemEditorOpen, setSubItemEditorOpen] = useState(false)
  const [menuName, setMenuName] = useState('')
  const [errors, setErrors] = useState({})
  const [subMenus, setSubMenus] = useState({
    parent: '',
    linkName: '',
    linkUrl: '',
    opensNewTab: false
  })

  const handleValidation = () => {
    let formIsValid = true;
    let temporaryErrors = {}

    if(!subMenus['parent']) {
      formIsValid = false;
      temporaryErrors['parent'] = "Cannot be empty";
    }

    if(!subMenus['linkName']) {
      formIsValid = false;
      temporaryErrors['linkName'] = "Cannot be empty";
    }

    if(!subMenus['linkUrl']) {
      formIsValid = false;
      temporaryErrors['linkUrl'] = "Cannot be empty";
    }

    setErrors(temporaryErrors)
    return formIsValid;
  }

  const handleMenuValidation = () => {
    let formIsValid = true;
    let temporaryErrors = {}

    if(!menuName) {
      formIsValid = false
      temporaryErrors['menuName'] = "Cannot be empty";
    }

    setErrors({
      ...errors,
      ...temporaryErrors
    })
    return formIsValid;
  }

  const handleSelectMenu = (evt) => {
    setSubMenus({
      ...subMenus,
      parent: evt.target.value
    })
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }

    setSubMenus({
      ...subMenus,
      [name]: value
    })
  }

  const handleChangeCheck = (e) => {
    setSubMenus({
      ...subMenus,
      opensNewTab: e.currentTarget.checked
    })
  }

  const handleMenu = (evt) => {
    if (errors['menuName']) {
      setErrors({
        ...errors,
        'menuName': ''
      })
    }
    setMenuName(evt.target.value)
  }

  const handleSubMenuEditor = (e) => {
    setMenuName('')
    setSubItemEditorOpen(e.currentTarget.checked)
  }

  const handleSubmitLinks = () => {
   if (handleValidation()) {
    const currentParent = menus.find((menu) => menu.parent === subMenus.parent)
    currentParent.items.push({
      ...subMenus,
      order: currentParent.items.length + 1
    })
    setSubMenus({
      parent: '',
      linkName: '',
      linkUrl: '',
      opensNewTab: false
    })
    setMenus([...menus])
   }
  }

  const handleSubmitMenu = () => {
    if (handleMenuValidation()) {
      const menuExists = menus.find((menu) => menu.parent === menuName)
      if (!menuExists) {
        setMenus([
          ...menus,
          {
            parent: menuName,
            items: [],
            order: menus.length + 1,
            initialPosition: 0
          }
        ])
        setMenuName('')
      } else {
        setErrors({
          ...errors,
          'menuName': 'This menu already exists'
        })
      }
    }
  }
  
  return (
    <div className='col-md-6 col-12 mt-3'>
      <div className='border-bottom border-dark py-3'>
        <div>
          <div class="form-group col-md-6 p-0">
            <label for="navItem">Menu section name</label>
            <input
              type="text"
              class="form-control"
              id="navItem"
              value={menuName || ''}
              aria-describedby="naviItemHelp"
              placeholder="Menu name"
              disabled={subItemEditorOpen}
              onChange={handleMenu}
            />
            <small id="naviItemHelp" class="form-text text-muted">The name for the top menu item</small>
            <span style={{ color: "red" }}>{errors["menuName"]}</span>
          </div>
          <div class="form-group mt-3 text-right p-0">
            <button
              class="btn btn-primary"
              type="button"
              onClick={handleSubmitMenu}
              disabled={subItemEditorOpen}
              style={{
                pointerEvents: subItemEditorOpen ? 'none' : 'all'
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div class="custom-control custom-switch my-4">
        <input type="checkbox" class="custom-control-input" id="toggleNavItem" onChange={handleSubMenuEditor} />
        <label class="custom-control-label" for="toggleNavItem">Toggle this switch to add sub-menu links</label>
      </div>
      {subItemEditorOpen && (
      <div className='border-bottom border-dark py-3'>
        <div >
          <div class="form-group col-md-6 p-0">
            <label for="parentMenu">Parent Menu</label>
            <select
              class="form-control"
              id="parentMenu"
              onChange={handleSelectMenu}
              required
              value={subMenus?.parent || ''}
            >
              <option selected>Choose a menu</option>
              {menus?.map((item) => (
                <option value={item.parent}>{item.parent}</option>
              ))}
            </select>
            <span style={{ color: "red" }}>{errors["parent"]}</span>
          </div>
          <div class="form-group col-md-6 p-0">
            <label for="navItem">Sub-menu link name</label>
            <input
              type="text"
              name="linkName"
              class="form-control"
              id="navItem"
              aria-describedby="naviItemHelp"
              placeholder="Link name"
              required
              value={subMenus?.linkName || ''}
              onChange={handleChange}
            />
            <small id="naviItemHelp" class="form-text text-muted">The name for the sub-menu link</small>
            <span style={{ color: "red" }}>{errors["linkName"]}</span>
          </div>
          <div class="form-group col-md-6 p-0">
            <label for="navItemUrl">Sub-menu link url</label>
            <input
              type="text"
              name="linkUrl"
              class="form-control"
              id="navItemUrl" 
              ria-describedby="naviItemUrlHelp"
              placeholder="Link url"
              required
              value={subMenus?.linkUrl || ''}
              onChange={handleChange}
            />
            <small id="naviItemUrlHelp" class="form-text text-muted">The url for the sub-menu link</small>
            <span style={{ color: "red" }}>{errors["linkUrl"]}</span>
          </div>
          <div class="form-check col-md-6">
            <input class="form-check-input" type="checkbox" value='' checked={subMenus?.opensNewTab} id="opensNewTab" onChange={handleChangeCheck} />
            <label class="form-check-label pl-3" for="opensNewTab">
              Link opens in a new tab
            </label>
          </div>
          <div class="form-group mt-3 text-right p-0">
            <button class="btn btn-primary" type="button" onClick={handleSubmitLinks}>Add</button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default SideBarEdits;