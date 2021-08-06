import React from 'react'
import { useAppSelector } from '../../../app/hooks';
import { selectPerson } from '../../person/personSlice';
import Base from './../../../base/Base';
import { selectUser } from './../userSlice';

function Network() {
    const {user} = useAppSelector(selectUser)
    const {person} = useAppSelector(selectPerson)
    console.log(user)
    console.log(person)
    return (
        <Base>
            <div className="flex justify-evenly border-b-4 p-5 border-gray-800">
                <h1>Followings</h1>
                <h1>Followers</h1>
            </div>
            <div>

            </div>
        </Base>
    )
}

export default Network
