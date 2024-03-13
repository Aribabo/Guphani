import * as firstAidRepository from '../data/firstAid.js';

export async function create(req, res) {
    try {
        const { title, contents, youtube } = req.body;
        const firstAid = await firstAidRepository.createfirstAid({
            title,
            contents,
            youtube
        });
        console.log(firstAid);
        return res.status(201).json(firstAid);
    } catch (error) {
        console.error('응급처치 생성 중 에러 발생:', error);
        return res.status(500).json({ error: '응급처치를 생성하는 중 에러가 발생했습니다.' });
    }
}

// 응급처치 전체보기
export async function getfirstAids(req, res) {
    try {
        const { title, contents, startDate, endDate } = req.query;
        const page = Number(req.query.page || 1); // 값이 없다면 기본값으로 1 사용
        const perPage = Number(req.query.perPage || 10);

        const query = { title, contents, startDate, endDate };
        const data = await firstAidRepository.getAll(query, page, perPage);

        return res.status(200).json(data);
    } catch (error) {
        console.error('응급처치 목록 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '응급처치 목록을 조회하는 중 에러가 발생했습니다.' });
    }
}

// 사용자 응급처치 전체보기
export async function userGetfirstAids(req, res) {
    try {
        const data = await firstAidRepository.userGetAll();
        console.log('사용자 응급처치 조회 요청');
        if (!data) {
            return res.status(500).json({ message: '응급처치가 없습니다.' });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error('사용자 응급처치 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '사용자 응급처치를 조회하는 중 에러가 발생했습니다.' });
    }
}

// 응급처치 상세보기
export async function getfirstAid(req, res, next) {
    try {
        console.log('응급처치 상세 조회 요청');
        const { id } = req.query;
        const firstAid = await firstAidRepository.getById(id);
        console.log(id);
        if (firstAid) {
            return res.status(200).json(firstAid);
        } else {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('응급처치 상세 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '응급처치 상세 정보를 조회하는 중 에러가 발생했습니다.' });
    }
}

// 응급처치 수정
export async function updatefirstAid(req, res, next) {
    try {
        const id = req.params.id;
        const { title, contents, youtube } = req.body;
        const firstAid = firstAidRepository.getById(id);
        if (!firstAid) {
            return res.status(404).json({ message: '게시글이 없습니다.' });
        }
        const update = await firstAidRepository.update(id, { title, contents, youtube });
        return res.status(200).json(update);
    } catch (error) {
        console.error('응급처치 수정 중 에러 발생:', error);
        return res.status(500).json({ error: '응급처치를 수정하는 중 에러가 발생했습니다.' });
    }
}

// 응급처치 삭제
export async function deletefirstAid(req, res) {
    try {
        const id = req.params.id;
        const firstAid = await firstAidRepository.getById(id);

        if (!firstAid) {
            return res.status(400).json({ message: "게시물이 없습니다." });
        }
        const del = await firstAidRepository.remove(id);
        res.sendStatus(200);
    } catch (error) {
        console.error('응급처치 삭제 중 에러 발생:', error);
        return res.status(500).json({ error: '응급처치를 삭제하는 중 에러가 발생했습니다.' });
    }
}

// 응급처치 삭제
export async function deletefirstAids(req, res) {
    try {
        const datas = req.body;
        const del = await firstAidRepository.removes(datas.ids);
        res.sendStatus(200);
    } catch (error) {
        console.error('다수의 응급처치 삭제 중 에러 발생:', error);
        return res.status(500).json({ error: '다수의 응급처치를 삭제하는 중 에러가 발생했습니다.' });
    }
}
