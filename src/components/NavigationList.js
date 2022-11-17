import React, { useState, useRef, useEffect, createRef } from 'react'
import Draggable from 'react-draggable';
import apiFetch from '@wordpress/api-fetch'
import MenuItemContainer from './MenuItemContainer'

const NavigationList = ({ menus, setUpdateMenu }) => {
  const [navigationData, setNavigationData] = useState([])
  const [heights, setHeights] = useState([])
  const elementsRef = useRef([]);
  const linkRef = useRef(null)

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

	const handleDrag = (
		e,
		data,
		initialPosition,
		threshold,
    arrayIndex
	) => {
		const currentOrder = +data.node.getAttribute('order');
		let newOrder = currentOrder;
		const collisionPosition = data.lastY;
    let movingDown = false
    let movingUp = false

		if (collisionPosition >= initialPosition + threshold) {
			movingDown = true
      newOrder =
				currentOrder < navigationData.length ? currentOrder + 1 : navigationData.length;
		} else if (collisionPosition < initialPosition - threshold) {
      movingUp = true
			newOrder = currentOrder > 1 ? currentOrder - 1 : 1;
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

      let itemHeight = heights[arrayIndex]
      let swapItemHeight = heights[navigationData.indexOf(swapItem)]

      if (movingDown) {
        currentItem.initialPosition = currentItem.initialPosition + swapItemHeight
        swapItem.initialPosition = swapItem.initialPosition - itemHeight
      }
      if (movingUp) {
        currentItem.initialPosition = currentItem.initialPosition - swapItemHeight
        swapItem.initialPosition = swapItem.initialPosition + itemHeight
      }

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
				currentOrder < itemData.items.length ? currentOrder + 1 : itemData.items.length;
		} else if (collisionPosition < initialPosition - threshold) {
			newOrder = currentOrder > 1 ? currentOrder - 1 : 1;
		}

		if (newOrder !== currentOrder) {
			const currentItem = itemData.items.find(
				(itemMenu) => itemMenu.order === currentOrder
			);
			const swapItem = itemData.items.find(
				(itemMenu) => itemMenu.order === newOrder
			);
			currentItem.order = newOrder;
			swapItem.order = currentOrder;

			setNavigationData([...navigationData]);
		}
	};

  const updateMetaData =  async () => {
    await apiFetch({
      path: '/saveTopMenu', // TODO better configure
      method: 'POST',
      data: {
        menu: JSON.stringify(navigationData)
      }
    })      
    .then( ( res ) => {
      console.log( res );
    } );
  }

  const handleDeleteMenu =  async (item) => {
    setUpdateMenu(item, false)
  }

  const handleDeleteLink =  async (item) => {
    setUpdateMenu(false, item)
  }

  return (
    <div className='col-md-6 col-12 mt-3 border-left'>
      <div className='col-md-8 col-12 px-0 ml-auto'>
        {menus?.map((item, index) => {
          const itemHeight = heights[index] || 51;
          return (
            <>
              <Draggable
                disabled={false}
                axis="y"
                bounds={'parent'}
                handle={'.draggable-section'}
                position={{
                  x: 0,
                  y: item.initialPosition,
                }}
                defaultClassNameDragging="draggable-menu"
                onDrag={(e, data) => handleDrag(e, data, item.initialPosition, itemHeight / 2, index)}
                onStop={() => console.log('stopee')}
              >
                <div ref={(el) => (elementsRef.current[index] = el)} order={item.order} className='py-2'>
                  <MenuItemContainer label={item.parent} className='draggable-section' pointer='move' deleteElemnt={() => handleDeleteMenu(item)}/>
                  {item?.items?.map((link, index2) => {
                    const linkHeight = 67.5
                    const positionInitial = (link.order - index2 - 1)*linkHeight
                    return (
                      <Draggable
                        disabled={item?.items.length < 2}
                        axis="y"
                        bounds={'parent'}
                        position={{
                          x: 0,
                          y: positionInitial,
                        }}
                        defaultClassNameDragging="draggable-links"
                        onDrag={(e, data) => handleLinkDrag(e, data, positionInitial, linkHeight / 2, item)}
                      >
                        <div ref={linkRef} order={link.order} className='py-2 w-75 ml-auto'>
                          <MenuItemContainer label={link.linkName} pointer='ns-resize' deleteElemnt={() => handleDeleteLink(link)}/>
                        </div> 
                      </Draggable>
                    )
                  })}
                </div> 
              </Draggable>
            </>
          )
        })}
      </div>
      {navigationData.length > 0 && (
        <div class="d-flex mt-3 justify-content-end p-0">
          <button
            class="btn btn-primary mr-2"
            type="button"
            onClick={updateMetaData}
          >
            Save
          </button>
          <button
            class="btn btn-primary"
            type="button"
          >
            Publish
          </button>
        </div>
      )}
    </div>
  )
}

export default NavigationList;