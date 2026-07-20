import { test, expect, Page } from '@playwright/test';

async function snap(page: Page, label: string) {
  await test.info().attach(label, { body: await page.screenshot(), contentType: 'image/png' });
}

test('tc_3000 | 지도 탭 진입', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await snap(page, '지도 탭 진입 화면');
  await expect(page.getByText('우리 집 지도')).toBeVisible();
  await expect(page.getByText('같이 볼 것들')).toBeVisible();
  await expect(page.getByText('우리 플레이스 북')).toBeVisible();
});

test('tc_3001 | 콘텐츠 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('textbox', { name: '제목 입력' }).fill('테스트 영화');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '콘텐츠 추가 후 목록 반영 확인');
  await expect(page.getByText('테스트 영화')).toBeVisible();
});

test('tc_3002 | 콘텐츠 추가 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('textbox', { name: '제목 입력' }).fill(' ');
  await snap(page, '공백 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_3003 | 콘텐츠 추가 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('textbox', { name: '제목 입력' }).fill('!@#$%');
  await snap(page, '특수문자 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_3024 | 콘텐츠 추가 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('textbox', { name: '제목 입력' }).fill('가'.repeat(201));
  await snap(page, '200자 초과 입력 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_3025 | 콘텐츠 추가 - 카테고리', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('textbox', { name: '제목 입력' }).fill('카테고리 테스트');
  await page.getByRole('combobox').selectOption('drama');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '카테고리 지정 후 항목/태그 반영 확인');
  await expect(page.getByText('카테고리 테스트')).toBeVisible();
  await expect(page.getByText('드라마')).toBeVisible();
});

test('tc_3026 | 카테고리 칩', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await snap(page, '콘텐츠 카테고리 칩 노출 확인');
  await expect(page.getByRole('button', { name: '전체' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '영화' })).toBeVisible();
  await expect(page.getByRole('button', { name: '드라마' })).toBeVisible();
  await expect(page.getByRole('button', { name: '기타' }).first()).toBeVisible();
});

test('tc_3004 | 카테고리 칩 - 다중 선택', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '영화' }).click();
  await page.getByRole('button', { name: '드라마' }).click();
  await snap(page, '영화+드라마 다중 선택 후 활성 상태 확인');
  await expect(page.getByRole('button', { name: '영화' })).toHaveClass(/active|selected/);
  await expect(page.getByRole('button', { name: '드라마' })).toHaveClass(/active|selected/);
});

test('tc_3005 | 같이 본 것들', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('textbox', { name: '제목 입력' }).fill('같이 본 테스트');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '체크 전 - 콘텐츠 목록에 존재 확인');
  await page.getByText('같이 본 테스트').locator('..').getByRole('checkbox').click();
  await snap(page, '체크 후 - 목록에서 사라짐 확인');
  await expect(page.getByText('같이 본 테스트')).not.toBeVisible();
});

test('tc_3007 | 같이 본 것들 - 닫기', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '같이 본 것들' }).click();
  await snap(page, '같이 본 것들 모달 열림 확인');
  await expect(page.getByText('같이 본 것들')).toBeVisible();
  await page.getByRole('button', { name: '닫기' }).click();
  await snap(page, '닫기 클릭 후 모달 닫힘 확인');
  await expect(page.getByRole('button', { name: '닫기' })).not.toBeVisible();
});

test('tc_3014 | 장소 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('테스트 장소');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '장소 추가 후 목록 반영 확인');
  await expect(page.getByText('테스트 장소')).toBeVisible();
});

test('tc_3015 | 장소 추가 - 장소 이름 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill(' ');
  await snap(page, '이름 공백 입력 - 저장 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();
});

test('tc_3016 | 장소 추가 - 장소 이름 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('!@#$%');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '이름 특수문자 입력 후 저장 결과 확인');
  await expect(page.getByText('!@#$%')).toBeVisible();
});

test('tc_3017 | 장소 추가 - 장소 이름 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('가'.repeat(201));
  await snap(page, '이름 200자 초과 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();
});

test('tc_3034 | 장소 추가 - 주소', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('주소 테스트 장소');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구 을지로3가');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '주소 입력 후 저장 결과 확인');
  await expect(page.getByText('서울시 중구 을지로3가')).toBeVisible();
});

test('tc_3027 | 장소 추가 - 주소 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('테스트 장소');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill(' ');
  await snap(page, '주소 공백 입력 - 저장 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();
});

test('tc_3028 | 장소 추가 - 주소 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('테스트 장소');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('!@#$%');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '주소 특수문자 입력 후 저장 결과 확인');
  await expect(page.getByText('!@#$%')).toBeVisible();
});

test('tc_3029 | 장소 추가 - 주소 : 500자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('가'.repeat(501));
  await snap(page, '주소 500자 초과 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('500자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();
});

test('tc_3030 | 장소 추가 - 카테고리 적용', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('카페 테스트');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByRole('combobox').selectOption('cafe');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '카테고리 지정 후 저장 결과 확인');
  await expect(page.getByText('카페 테스트')).toBeVisible();
  await expect(page.getByText('카페')).toBeVisible();
});

test('tc_3018 | 장소 추가 - 별점', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('별점 테스트');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.locator('.star').nth(3).click();
  await snap(page, '별점 선택 후 저장 전 상태 확인');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '저장 후 목록 반영 확인');
  await expect(page.getByText('별점 테스트')).toBeVisible();
});

test('tc_3019 | 장소 추가 - 별점 - 미설정', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('별점 미설정 테스트');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '별점 미설정 저장 결과 확인');
  await expect(page.getByText('별점 미설정 테스트')).toBeVisible();
});

test('tc_3020 | 장소 추가 - 한줄평', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('한줄평 테스트');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByPlaceholder('한줄평 (예: 분위기 최고, 재방문 의사 100%)').fill('분위기 최고!');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '한줄평 입력 후 저장 결과 확인');
  await expect(page.getByText('분위기 최고!')).toBeVisible();
});

test('tc_3031 | 장소 추가 - 한줄평 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('한줄평 공백 테스트');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByPlaceholder('한줄평 (예: 분위기 최고, 재방문 의사 100%)').fill(' ');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '한줄평 공백 입력 - 저장은 정상 처리되는지 확인');
  await expect(page.getByText('한줄평 공백 테스트')).toBeVisible();
});

test('tc_3032 | 장소 추가 - 한줄평 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('한줄평 특수문자 테스트');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByPlaceholder('한줄평 (예: 분위기 최고, 재방문 의사 100%)').fill('!@#$%');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '한줄평 특수문자 입력 후 저장 결과 확인');
  await expect(page.getByText('!@#$%')).toBeVisible();
});

test('tc_3033 | 장소 추가 - 한줄평 : 1000자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('한줄평 (예: 분위기 최고, 재방문 의사 100%)').fill('가'.repeat(1001));
  await snap(page, '한줄평 1000자 초과 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('1000자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();
});

test('tc_3021 | 장소 추가 - 취소', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('취소 테스트');
  await page.getByRole('button', { name: '취소' }).click();
  await snap(page, '취소 클릭 후 모달 닫힘 확인');
  await expect(page.getByText('장소 추가')).not.toBeVisible();
  await expect(page.getByText('취소 테스트')).not.toBeVisible();
});

test('tc_3022 | 장소 추가 - 저장', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('저장 테스트 장소');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '저장 완료 후 모달 닫힘 및 목록 반영 확인');
  await expect(page.getByText('장소 추가')).not.toBeVisible();
  await expect(page.getByText('저장 테스트 장소')).toBeVisible();
});

test('tc_3023 | 장소 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '지도' }).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByPlaceholder('장소 이름 (예: 을지로 카페)').fill('삭제할 장소');
  await page.getByPlaceholder('주소 또는 동네 (예: 을지로3가)').fill('서울시 중구');
  await page.getByRole('button', { name: '저장' }).click();
  await snap(page, '삭제 전 - 장소 카드 존재 확인');
  await page.getByText('삭제할 장소').locator('..').getByRole('button').click();
  await snap(page, '삭제 후 - 장소 카드 제거 확인');
  await expect(page.getByText('삭제할 장소')).not.toBeVisible();
});