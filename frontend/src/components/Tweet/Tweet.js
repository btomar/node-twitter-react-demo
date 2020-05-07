import React from 'react'
import { Item, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import './Tweet.css';

const Tweet = props => {
  const { user, text , created_at} = props.tweet
  return (
    <Item raised centered fluid className="item-container">
      <Item.Content fluid className="item-image">
        <Image size='mini' src={user.profile_image_url} />
      </Item.Content>
      <Item.Content floated='left'>
      <Item.Header>{user.name}</Item.Header>
        <Item.Meta><a href={`https://twitter.com/${user.screen_name}`} target='_blank' rel="noopener noreferrer">{`@${user.screen_name}`}</a></Item.Meta>
        <Item.Description>
          {text}
        </Item.Description>
        <Item.Extra>{created_at}</Item.Extra>
      </Item.Content>
    </Item>
  )
}

Tweet.propTypes = {
  tweet: PropTypes.object.isRequired
}

export default Tweet