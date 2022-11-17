import React, { useState, useRef, useEffect, createRef } from 'react'
import Draggable from 'react-draggable';
import apiFetch from '@wordpress/api-fetch'
import MenuItemContainer from './MenuItemContainer'

const TopNavigation = ({ menus, updatedMenus, editItem }) => {
  const [navigationData, setNavigationData] = useState([])
  const [heights, setHeights] = useState([])
  const elementsRef = useRef([]);
  const linkRef = useRef(null)
  const [showZone, setShowZone] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)
  const [showSubMenus, setShowSubMenus] = useState([])

  useEffect(() => {
    if (elementsRef.current !== null) {
      const nextHeights = elementsRef?.current?.map(
        (ref) => {
          if (ref && ref !== null) {
            return ref.getBoundingClientRect().height
          }
        }
      );
    
      setHeights(nextHeights);
    }
    setNavigationData(menus)

  }, [menus])

  useEffect(() => {
    if (elementsRef.current !== null) {
      const nextHeights = elementsRef?.current?.map(
        (ref) => {
          if (ref && ref !== null) {
            return ref.getBoundingClientRect().height
          }
        }
      );
    
      setHeights(nextHeights);
    }
  }, [showSubMenus])

	const handleDrag = (
		e,
		data,
		initialPosition,
		threshold,
    arrayIndex
	) => {
		const currentOrder = +data.node.getAttribute('order');
    data.node.style.zIndex = 999;
    data.node.style.position = 'relative';
		let newOrder = currentOrder;
		const collisionPosition = data.lastY;
    let movingDown = false
    let movingUp = false
    let itemHeight = heights[arrayIndex]
    const collisionPositionX = data.lastX
    const isGroup = navigationData[arrayIndex].childrens.length > 0
 
		if (collisionPosition >= initialPosition + threshold) {
			movingDown = true
      if (isGroup || !navigationData[arrayIndex].isChildren) {
        newOrder = currentOrder < navigationData.length ? currentOrder + 1 : navigationData.length;
      }
		} else {
      movingUp = true
      if ((isGroup && currentOrder > 1) || !navigationData[arrayIndex].isChildren) {
        const swapItem = navigationData.find((item) => item.order == (currentOrder - 1))
        let swapItemHeight = heights[navigationData.indexOf(swapItem)]

        if (collisionPosition < initialPosition - (swapItemHeight*0.8)) {
          newOrder = currentOrder > 1 ? currentOrder - 1 : 1;
        }
      }
    }

    if (collisionPositionX > 30 && !showZone && navigationData[arrayIndex].childrens.length === 0) {
      setShowZone(true)
    }
    
    if (collisionPositionX < 30 && showZone && navigationData[arrayIndex].childrens.length === 0) {
      setShowZone(false)
    }

		if (newOrder !== currentOrder) {
			const currentItem = navigationData.find(
				(itemMenu) => itemMenu.order === currentOrder
			);
			const swapItem = navigationData.find(
				(itemMenu) => itemMenu.order === newOrder
			);
			currentItem.order = newOrder;
			swapItem.order = currentOrder;

      let swapItemHeight = heights[navigationData.indexOf(swapItem)]

      if (movingDown) {
        currentItem.initialPosition = currentItem.initialPosition + swapItemHeight
        swapItem.initialPosition = swapItem.initialPosition - itemHeight
      }
      if (movingUp) {
        currentItem.initialPosition = currentItem.initialPosition - swapItemHeight
        swapItem.initialPosition = swapItem.initialPosition + itemHeight
      }

      setHasUpdate(true)
			setNavigationData([...navigationData]);
		}
	};

  const handleLinkDrag = (
		e,
		data,
		initialPosition,
		threshold,
    itemData
	) => {
		const currentOrder = +data.node.getAttribute('order');
		let newOrder = currentOrder;
		const collisionPosition = data.lastY;
    
		if (collisionPosition > initialPosition + threshold) {
      newOrder =
				currentOrder < itemData.childrens.length ? currentOrder + 1 : itemData.childrens.length;
		} else if (collisionPosition < initialPosition - threshold) {
			newOrder = currentOrder > 1 ? currentOrder - 1 : 1;
		}

		if (newOrder !== currentOrder) {
			const currentItem = itemData.childrens.find(
				(itemMenu) => itemMenu.order === currentOrder
			);
			const swapItem = itemData.childrens.find(
				(itemMenu) => itemMenu.order === newOrder
			);
			currentItem.order = newOrder;
			swapItem.order = currentOrder;

			setNavigationData([...navigationData]);
		}
	};

  const handleReleaseMenu = (e, data) => {
    data.node.style.zIndex = 1;
    const currentOrder = +data.node.getAttribute('order');

    if (showZone && currentOrder > 1) {
      const itemToRemove = navigationData.find((element) => element.order == currentOrder);
      const itemToUpdate = navigationData.find((element) => element.order == (currentOrder - 1));

      const newChildren = {
        childrenName: itemToRemove.menuName,
        order: itemToUpdate.childrens.length + 1,
        isChildren: true,
        linkUrl: itemToRemove?.menuLink || '#',
        opensNewTab: itemToRemove.opensNewTab
      }

      itemToUpdate.childrens.push(newChildren)

      const newData = navigationData.filter((item) => item.order != currentOrder)

      newData.forEach((menuItem, index) => {
        menuItem.order = index + 1
      })

      setNavigationData([...newData])
      updatedMenus(newData)
      setShowZone(false)
      setHasUpdate(false)
    } else if (hasUpdate) {
      setHasUpdate(false)
      updatedMenus(navigationData)
    }
  }
  console.log(navigationData)
  const handleAddNewItem = () => {
    const newItemMenu = {
      menuName: 'Menu',
      menuLink: '#',
      childrens: [],
      order: navigationData.length + 1,
      isChildren: false,
      opensNewTab: false,
      initialPosition: 0
    }

    navigationData.push(newItemMenu)

    setNavigationData([...navigationData])
    updatedMenus(navigationData)
  }

  const handleToggleMenus = (index) => {
    if (showSubMenus.includes(index)) {
      const newList = showSubMenus.filter((item) => item !== index)
      setShowSubMenus(newList)
    } else {
      showSubMenus.push(index)
      setShowSubMenus([...showSubMenus])
    }
  }

  const handleDeleteElement = (el, index, index2 = -1) => {
    if (el.isChildren && index2 >= 0) {
      navigationData[index].childrens.splice(index2, 1)
      navigationData[index].childrens.forEach((child, i) => {
        child.order = i + 1
      })
      setNavigationData([...navigationData])
      updatedMenus([...navigationData])
    }

    if (!el.isChildren) {
      navigationData.splice(index, 1)
      navigationData.forEach((item, i) => {
        item.order = i + 1
      })

      setNavigationData([...navigationData])
      updatedMenus([...navigationData])
    }
  }

  return (
    <div className='col-md-6 col-12 mt-5 dragg-zone px-0'>
      <div className='col-md-11 col-12 px-0 mr-auto'>
        {menus?.map((item, index) => {
          const itemHeight = heights[index] || 51;
          const isInnerDropZone = showZone && item?.childrens?.length > 0
          const displaySubList = showSubMenus.includes(item.menuName)

          return (
            <>
              <Draggable
                disabled={false}
                axis={item?.childrens?.length > 0 ? 'y' : 'both'}
                bounds={'.dragg-zone'}
                handle={'.draggable-section'}
                position={{
                  x: 0,
                  y: item.initialPosition,
                }}
                defaultClassNameDragging="draggable-menu"
                onDrag={(e, data) => handleDrag(e, data, item.initialPosition, itemHeight*0.8, index)}
                onStop={(e, data) => handleReleaseMenu(e, data)}
              >
                <div ref={(el) => (elementsRef.current[index] = el)} order={item.order} className={`py-2 ${item.isChildren ? 'ml-auto w-75' : ''}`}>
                  <MenuItemContainer
                    label={item.menuName}
                    showSubMenus={displaySubList}
                    toggleMenuChildrens={() => handleToggleMenus(item.menuName)}
                    hasChildrens={item?.childrens?.length > 0}
                    deleteElemnt={() => handleDeleteElement(item, index)}
                    draggClass='draggable-section'
                    editElement={() => editItem({...item, location: [index]})}
                  />
                  <div
                    className={`${displaySubList ? 'd-block' : 'd-none'} position-relative ${isInnerDropZone ? 'py-1' : 'p-0'}`}
                  >
                    <div
                      className={`position-fixed ${isInnerDropZone ? 'd-block' : 'd-none'}`}
                      style={{
                        zIndex: 0,
                        width: '80%',
                        marginLeft: 'auto',
                        border: '2px dashed',
                        top: '65px',
                        bottom: 0,
                        right: '27px'
                      }}
                    />
                    {item?.childrens?.map((link, index2) => {
                      const linkHeight = 67.5
                      const positionInitial = (link.order - index2 - 1)*linkHeight
                      return (
                        <Draggable
                          bounds={'.dragg-zone'}
                          position={{
                            x: 0,
                            y: positionInitial,
                          }}
                          handle={'.draggable-links-section'}
                          defaultClassNameDragging="draggable-links"
                          onDrag={(e, data) => handleLinkDrag(e, data, positionInitial, linkHeight / 2, item)}
                        >
                          <div ref={linkRef} order={link.order} className={`py-2 ${link.isChildren ? 'ml-auto w-75' : ''}`}>
                            <MenuItemContainer
                              label={link.childrenName}
                              deleteElemnt={() => handleDeleteElement(link, index, index2)}
                              draggClass='draggable-links-section'
                              editElement={() => editItem({...link, location: [index, index2]})}
                            />
                          </div> 
                        </Draggable>
                      )
                    })}
                  </div>
                </div> 
              </Draggable>
            </>
          )
        })}
      </div>
      <div className='text-center mt-5 col-11'>
        <button className='btn btn-primary d-flex mx-auto' type='button' onClick={handleAddNewItem}>
          Add
          <i class="arrow-white ml-2" />
        </button>
      </div>
    </div>
  )
}

export default TopNavigation;